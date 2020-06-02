import React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import { TableTools } from "use-table-tools"

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <Link to="/page-2/">Go to page 2</Link> <br />
    <Link to="/using-typescript/">Go to "Using TypeScript"</Link>
    <TableTools
      layout={{
        280: ["0 0 100%"],
        348: ["0 0 50%", "0 0 50%"],
        768: ["0 0 35%", "1 1 35%", "0 0 30%"],
        1200: ["0 0 25%", "1 1 35%", "0 0 20%", "0 0 20%"],
        1440: [
          "0 0 25%",
          "1 1 35%",
          "0 0 10%",
          "0 0 10%",
          "0 0 10%",
          "0 0 10%",
        ],
      }}
      columns={[]}
      clientSortBy={{ direction: "asc", fieldKey: "name" }}
      totalItems={0}
    >
      {({
        currentLayout,
        visibleColumns,
        clientSortMethod,
        onSelection,
        selectAllCheckboxState,
        checkboxState,
        checkboxShiftToggle,
      }) => <div>hello from table tools</div>}
    </TableTools>
  </Layout>
)

export default IndexPage
