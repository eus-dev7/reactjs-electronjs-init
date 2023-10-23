import React, { Component } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/scss/style.scss";
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);
const Layout = React.lazy(() => import("./Layout"));

class App extends Component {
  render() {
    return (
      <HashRouter>
        <React.Suspense fallback={loading}>
          <Layout>
            <Switch>
              <Route
                path="/"
                name="Home"
                render={(props) => <Layout {...props} />}
              />
            </Switch>
            {window.location}
          </Layout>
        </React.Suspense>
      </HashRouter>
    );
  }
}

export default App;
