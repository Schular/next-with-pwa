import Home from "@/components/Home";
import Head from "next/head";

export default function TestPages() {
  return (
    <>
      <Head>
        <title>Next PWA</title>
        <meta
          name="description"
          content="Next PWA example using next-pwa and app directory"
        />
      </Head>
      <Home title="Pages" />
    </>
  );
}
