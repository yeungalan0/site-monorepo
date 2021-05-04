import { GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (context.resolvedUrl === "/") {
    return {
      redirect: {
        permanent: false,
        destination: "/blog", // homepage to redirect to
      },
    };
  }
}

function IgnoredPage() {
  return <div></div>;
}

export default IgnoredPage;
