import { HashRouter, Route, Routes } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";

import Layout from "./components/general/Layout";

import HomePage from "./pages/HomePage";
import JobLoadingPage from "./pages/loading/job_id";
import React from "react";

function App() {
  return (
    <HashRouter>
      <QueryParamProvider adapter={ReactRouter6Adapter}>
        <Layout>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/loading/:job_id' element={<JobLoadingPage />} />
          </Routes>
        </Layout>
      </QueryParamProvider>
    </HashRouter>
  );
}

export default App;
