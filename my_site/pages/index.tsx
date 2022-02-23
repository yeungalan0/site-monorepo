import { GetServerSidePropsContext } from "next";

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<
  | {
      redirect: {
        permanent: boolean;
        destination: string;
      };
    }
  | undefined
> {
  if (context.resolvedUrl === "/") {
    return {
      redirect: {
        permanent: false,
        destination: "/blog", // homepage to redirect to
      },
    };
  }
}

function IgnoredPage(): JSX.Element {
  return <div></div>;
}

export default IgnoredPage;
