import React, { useCallback } from 'react';
import Layout from './Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/App.css';
import { appConfig } from '../utils/constants';
import { configure, User } from 'radiks';
import { Connect } from '@blockstack/connect';
import DiagnosticContainer from './DiagnosticContainer';
import Map from './Map';
import { BrowserRouter, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactBlockstack, { useBlockstack, didConnect } from 'react-blockstack';
import setLoginLoading from '../redux/actions/actions';
import FactQuizContainer from './FactQuizContainer';
import PrivateRoute from './PrivateRoute';
import SymptomsTracker from './SymptomsTracker';
import OnboardUser from './OnboardUser';

const RADIKS_URL = process.env.REACT_APP_QA_URL || 'http://127.0.0.1:1260'; // TODO this will change to wherever our radiks server will be hosted in prod

ReactBlockstack({ appConfig });

function App(props) {
  const { userSession } = useBlockstack();
  const finished = useCallback(({ userSession }) => {
    if (RADIKS_URL) {
      configure({
        apiServer: RADIKS_URL,
        userSession,
      });
      User.createWithCurrentUser();
    }
    didConnect({ userSession });
  }, []);
  const authOptions = {
    redirectTo: '/',
    finished: finished,
    appDetails: {
      name: 'Corona Tracker',
      icon: `${window.location.origin}/icon.png`,
    },
    userSession,
  };

  return (
    <BrowserRouter>
      <Connect authOptions={authOptions}>
        <Layout>
          <Switch>
            <PrivateRoute exact path="/" component={() => <DiagnosticContainer />} />

            {/* ADD/EDIT ROUTES WITH THEIR COMPONENTS HERE: */}
            <PrivateRoute path="/signup" />
            <PrivateRoute path="/symptomsurvey" component={() => <SymptomsTracker />} />
            <PrivateRoute path="/log" />
            <PrivateRoute path="/healthlog" />
            <PrivateRoute path="/education" component={() => <FactQuizContainer />} />
            <PrivateRoute path="/map" component={() => <Map />} />
            <PrivateRoute path="/settings" />
            <PrivateRoute path="/onboard" component={OnboardUser} />
          </Switch>
        </Layout>
      </Connect>
    </BrowserRouter>
  );
}

const mapStateToProps = ({ loginLoading }) => ({
  loginLoading,
});

const mapDispatchToProps = dispatch => ({
  setLoading(isLoading) {
    return () => {
      dispatch(setLoginLoading(isLoading));
    };
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
