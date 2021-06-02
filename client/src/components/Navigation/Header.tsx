import styles from "./Header.module.scss";

import { Button } from "@material-ui/core";
import { useStore } from "../../store";
import AccountMenu from "./AccountMenu";
import { useHistory } from "react-router";

const Header = () => {
  const { currentUser } = useStore();
  const history = useHistory();
  const HandleSignupClick = () => {
    history.push("/account/signup");
  };
  const HandleLoginClick = () => {
    history.push("/account/login");
  };
  return (
    <div className={styles.header}>
      {currentUser.id.length === 0 ? (
        <>
          <Button variant="outlined" className={styles.button} onClick={HandleSignupClick}>
            Sign Up
          </Button>
          <Button variant="outlined" className={styles.button} onClick={HandleLoginClick}>
            Login
          </Button>
        </>
      ) : (
        <AccountMenu />
      )}
    </div>
  );
};
export default Header;
