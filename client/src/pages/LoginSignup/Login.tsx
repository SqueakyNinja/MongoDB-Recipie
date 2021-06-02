import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { Button, TextField, Paper } from "@material-ui/core";
import styles from "./index.module.scss";
import { validateLoginInfo } from "./validation";
import { sendLogin } from "../../db/users";
import { Link, useHistory } from "react-router-dom";
import { useStore } from "../../store";

interface Values {
  username: string;
  password: string;
}

interface Errors {
  username?: string;
  password?: string;
}

const Login = () => {
  const { setSnackbar, setCurrentUser } = useStore();
  const history = useHistory();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({});
  const values = useRef<Values>({
    username: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    values.current = {
      ...values.current,
      [name]: value,
    };
    setErrors(validateLoginInfo(values.current));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (Object.keys(errors).length === 0) {
      const user = {
        username: values.current.username,
        password: values.current.password,
      };
      try {
        const tryLogin = await sendLogin(user);
        setSnackbar(tryLogin.message, "success");
        setCurrentUser({ username: tryLogin.username, id: tryLogin.id });
        history.push("/");
      } catch (error) {
        setSnackbar(error.response.data.message, "error");
      }
    } else {
      setSnackbar("Please resolve all errors and try again!", "error");
    }
  };

  return (
    <div className={styles.signupRight}>
      <Paper className={styles.formPaper}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <h1>Please log in to continue</h1>
          <div className={styles.formInputs}>
            <TextField
              className={styles.input}
              variant="outlined"
              id="username"
              type="text"
              name="username"
              label="Username"
              onChange={handleChange}
            />
            {errors.username && submitting && <p>{errors.username}</p>}
          </div>

          <div className={styles.formInputs}>
            <TextField
              variant="outlined"
              id="password"
              type="password"
              name="password"
              label="Password"
              className={styles.input}
              onChange={handleChange}
            />
            {errors.password && submitting && <p>{errors.password}</p>}
          </div>

          <Button color="primary" variant="contained" type="submit" className={styles.button}>
            Login
          </Button>
          <p className="form-input-login">Don't have an account?</p>
          <Link to="/account/signup">Sign up here</Link>
        </form>
      </Paper>
    </div>
  );
};

export default Login;
