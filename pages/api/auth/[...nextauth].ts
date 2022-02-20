import NextAuth, { Account } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import {
  Birthdate,
  PeopleData,
  Providers,
} from "../../../src/life-in-weeks/definitions";
import { dynamoAdapter, isValidDate } from "../../../src/life-in-weeks/utils";
import { fetcher } from "../../../src/utils";

async function getBirthdateFromGoogle(
  bearerToken: string
): Promise<string | undefined> {
  const isBirthdate = (bd: {
    year: number | undefined;
    month: number;
    day: number;
  }): bd is Birthdate => {
    return (
      typeof bd.year === "number" &&
      typeof bd.month === "number" &&
      typeof bd.day === "number"
    );
  };

  const data = await fetcher(
    "https://people.googleapis.com/v1/people/me?personFields=birthdays",
    {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    }
  );

  const birthday = (data as PeopleData).birthdays?.find(
    (bd) => bd.metadata.source.type === "ACCOUNT"
  )?.date;
  if (birthday !== undefined && isBirthdate(birthday)) {
    console.debug("Found birthday from Google...");
    return `${birthday.month}/${birthday.day}/${birthday.year}`;
  }
}

async function getAndSaveBirthdate(
  account: Account | undefined,
  email: string | undefined | null
): Promise<string | undefined> {
  const userByEmail = email ? await dynamoAdapter.getUserByEmail(email) : null;

  if (userByEmail?.birthdate && typeof userByEmail.birthdate === "string") {
    console.debug("Found birthdate from database...");
    return userByEmail.birthdate;
  }

  let birthdate: string | undefined = undefined;

  if (
    account?.provider == Providers.GOOGLE &&
    typeof account.access_token === "string"
  ) {
    birthdate = await getBirthdateFromGoogle(account.access_token);
  }

  if (
    typeof birthdate === "string" &&
    typeof userByEmail?.id === "string" &&
    isValidDate(birthdate)
  ) {
    await dynamoAdapter.updateUser({
      id: userByEmail.id,
      birthdate: birthdate,
    });
    console.debug("Saved user birthdate into DB");
    return birthdate;
  }

  console.warn("No birthdate found from sources, returning undefined...");
  return undefined;
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId:
        "120141334684-b2k15io8eiahqshk5arvfm26kac8doap.apps.googleusercontent.com",
      // TODO: secret
      clientSecret: SECRET,
      authorization: {
        params: {
          scope:
            "openid profile email https://www.googleapis.com/auth/user.birthday.read",
        },
      },
    }),
    // ...add more providers here
  ],
  adapter: dynamoAdapter,
  secret: process.env.NEXTAUTH_JWT_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (token.birthdate) {
        return token;
      }

      const birthdate = await getAndSaveBirthdate(account, token.email);

      if (typeof birthdate === "string") {
        token.birthdate = birthdate;
      }

      return token;
    },
    async session({ session, token }) {
      session.birthdate = token.birthdate;
      return session;
    },
  },
});
