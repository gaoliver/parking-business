import React, { useState } from "react";
import styles from "./TextInput.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export interface TextInputProps extends React.HTMLProps<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  error,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={styles.component}>
      <label htmlFor={name}>{label}</label>

      <div className={`${styles.field_wrapper}${error ? ` ${styles.error}` : ""}`}>
        <input
          name={name}
          className={styles.field}
          {...props}
          type={isVisible ? "text" : props.type}
          placeholder={
            props.type === "password" ? "********" : props.placeholder
          }
        />

        {props.type === "password" && (
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className={styles.toggle_btn}
          >
            {isVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>

      {error && <span className={styles.error_message}>{error}</span>}
    </div>
  );
};
