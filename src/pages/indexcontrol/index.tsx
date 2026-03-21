import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => ({
  redirect: {
    destination: "/indexcontrol/dashboard",
    permanent: false,
  },
});

export default function IndexControlRoot() {
  return null;
}
