import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import { DOMAIN } from "../functions/constants";
import { Props } from "../interfaces";
import { NavMenu } from "./common";
import TitleHead from "./TitleHead";

const Subpage = ({
  children,
  title,
  subreddit,
  token,
  backgroundColor = "white"
}: Props) => (
  <div>
    <TitleHead title={title}>
      <meta name="description" content={`/r/${subreddit} on Reddium`} />
      <meta property="og:url" content={`${DOMAIN}/r/${subreddit}`} />
      <meta property="og:description" content={`/r/${subreddit} on Reddium`} />
      <meta property="og:image" content={`${DOMAIN}/reddium-sub.png`} />
    </TitleHead>
    <header
      style={{
        backgroundColor: backgroundColor
      }}
    >
      <nav className="flex items-center justify-center max-width-sub mx-auto z-50 h-16 lg:mx-12 sm:mx-6">
        <div className="flex-grow flex items-center">
          <Link href="/">
            <div className="pr-4 h-6 flex flex-row items-center cursor-pointer">
              <Image className="h-full sm:h-6" src="/reddium_symbol.svg" alt="Reddium Symbol" width={24} height={24} />
            </div>
          </Link>
        </div>
        <NavMenu token={token}/>
      </nav>
    </header>
    {children}
  </div>
);

export default Subpage;
