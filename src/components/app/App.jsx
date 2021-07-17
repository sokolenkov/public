import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { connect } from 'react-redux';
import { setCurrentUser } from '../../redux/actions/';
import { HomePage, ShopPage, SigninAndSignupPage } from '../../pages/';
import { Header } from '../';
import { auth, createUserProfileDocument } from '../../firebase';

class App extends React.Component {
  unSubscribeOnAuth = null;

  componentDidMount() {
    const { setCurrentUser } = this.props;

    this.unSubscribeOnAuth = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);

        userRef.onSnapshot((snapShot) => {
          setCurrentUser({
            id: snapShot.id,
            ...snapShot.data(),
          });
        });
      }
      setCurrentUser(userAuth);
    });
  }

  componentWillUnmount() {
    this.unSubscribeOnAuth();
  }

  render() {
    const { currentUser } = this.props;
    console.log(currentUser);

    return (
      <div className='app'>
        <Router>
          <Header />

          <Switch>
            <Route exact path='/' component={HomePage} />
            <Route path='/shop' component={ShopPage} />
            <Route
              exact
              path='/signin'
              render={() =>
                currentUser ? <Redirect to='/' /> : <SigninAndSignupPage />
              }
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

const stateToProp = ({ user }) => ({
  currentUser: user.currentUser,
});

const dispatchToProp = {
  setCurrentUser,
};

export default connect(stateToProp, dispatchToProp)(App);
