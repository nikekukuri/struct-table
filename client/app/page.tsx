import { VercelLogo } from "./components/logo";
import {
  DocsLink,
  LearnLink,
  TemplatesLink,
  DeployLink,
} from "./components/links";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">app/page.tsx</code>
        </p>
        <VercelLogo />
      </div>
      <div>
        <a
          href="/table"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          table
        </a>
      </div>
      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <div className="col-span-4 mb-4">
          <p className="w-full text-center">Next.js public Documents</p>
        </div>
        <DocsLink />
        <LearnLink />
        <TemplatesLink />
        <DeployLink />
      </div>
    </main>
  );
}
