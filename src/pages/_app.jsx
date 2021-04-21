import * as React from "react"
import "../styles/index.css"
import "inter-ui/inter.css"
import { DefaultSeo } from "next-seo"
import { defaultSeoProps, isProduction } from "~/constants"
import NextGA from "~/components/NextGA"
import "react-static-tweets/styles.css"

function App({ Component, pageProps }) {
  return (
    <>
      {isProduction && (
        <NextGA trackingId={process.env.NEXT_PUBLIC_GA_TRACKING_ID} />
      )}
      <DefaultSeo {...defaultSeoProps} />
      <Component {...pageProps} />
    </>
  )
}

export default App
