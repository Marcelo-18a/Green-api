import styles from "@/components/Container/Container.module.css";

const LoginContainer = ({ children }) => {
  return (
    <div className={styles.containerCover}>
      <div className={styles.loginContainer}>{children}</div>
    </div>
  );
};

export default LoginContainer;
