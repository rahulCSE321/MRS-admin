import { CircularProgress, styled } from "@mui/material";
import React, { useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../features/api/authApi";

const Login = () => {
  const [loginUser, { data, isError, isLoading, isSuccess, error }] =
    useLoginMutation();


  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      await loginUser(values);
    } catch (error) {
      console.log(error);
      toast.error( error?.data?.message)
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("email is required")
      .email("Invalid Email Formate"),
    password: Yup.string()
      .required("password is required")
      .min(5, "password must be 8 characters"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  const { values, handleBlur, handleChange, resetForm, errors, touched } =
    formik;

  useEffect(() => {
    if (isError && error) {
      toast.error(error?.data?.message || 'Something went wrong');
    }
    if (isSuccess && data) {
      toast.success(data?.message || "Login Successfully");
      resetForm();
      localStorage.setItem("authToken", data?.token);
      navigate("/users");
    }
  }, [isError, error, isSuccess, data]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/users");
    }
  }, []);

  return (
    <LoginMainContainer>
      <LoginContainer>
        <BlogText>MRS </BlogText>
        <FirsSection>
          <SignIn>SIGN IN</SignIn>
          <Para>Enter your credentials to access your account</Para>
        </FirsSection>
        <Form onSubmit={formik.handleSubmit}>
          <FormDetail>
            <Label htmlFor="email">Email</Label>
            <InputField
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email ..."
              type="email"
              name="email"
              id="email"
            />
            {touched.email && errors.email && (
              <p className="error">{errors.email}</p>
            )}
          </FormDetail>
          <FormDetail>
            <Label htmlFor="password">Password</Label>
            <InputField
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your password ..."
              type="password"
              name="password"
              id="password"
            />
            {touched.password && errors.password && (
              <p className="error">{errors.password}</p>
            )}
          </FormDetail>

          <SignInButton disabled={isLoading} type="submit">
            {isLoading ? (
              <div>
                <CircularProgress size={20} className="circularProgress" />{" "}
                Submitting{" "}
              </div>
            ) : (
              "Sign In"
            )}
          </SignInButton>
        </Form>
        <LastSection>
          <LastSectionFirstcontainer>
            <ForgotPassword href="">Forgot Password ?</ForgotPassword>
            <ResetPassword href="">Reset Password</ResetPassword>
          </LastSectionFirstcontainer>
          <LastSectionSecondcontainer>
            <ForgotPassword>Don't have an account?</ForgotPassword>
            <ResetPassword href="/register">Register</ResetPassword>
          </LastSectionSecondcontainer>
        </LastSection>
      </LoginContainer>
    </LoginMainContainer>
  );
};

export default Login;

const LoginMainContainer = styled("div")`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(0, 0, 0);

  @media (max-width: 600px) {
    background-color: #fff;
    align-items: start;
  }
`;
const LoginContainer = styled("div")`
  width: 475px;
  height: auto;
  border-radius: 20px;
  display: flex;
  background-color: #ffffff;
  padding: 25px;
  flex-direction: column;
  gap: 25px;
  align-items: center;
`;
const BlogText = styled("h1")`
  font: 700 32px Montserrat;
  color: #000000;
`;
const FirsSection = styled("div")`
  width: 318px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
`;
const SignIn = styled("p")`
  font: 600 20px Montserrat;
  color: #000000;
`;
const Para = styled("p")`
  font: 400 14px Montserrat;
  color: #6c6c6c;
`;
const Label = styled("label")`
  font: 500 16px Montserrat;
  color: #6c6c6c;
`;
const InputField = styled("input")`
  height: 60px;
  border-radius: 12px;
  border: 1px solid black;
  padding-left: 23px;
  font: 600 14px Montserrat;
  color: rgb(140, 130, 130);

  &:focus {
    outline: none;
    border-color: black;
    borderColor: error ? "red" : "black",
  }

  
`;
const Form = styled("form")`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const FormDetail = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const SignInButton = styled("button")`
  height: 60px;
  border-radius: 12px;
  border: 1px solid black;
  font: 600 14px Montserrat;
  color: rgb(251, 248, 248);
  background-color: black;
  cursor: pointer;
  transition: background-color 0.3s ease-in;

  &:hover {
    background-color: #feaf00;
    border: none;
  }

  &:focus {
    outline: none;
  }
`;
const LastSection = styled("div")`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const LastSectionFirstcontainer = styled("div")`
  display: flex;

  gap: 6px;
`;
const LastSectionSecondcontainer = styled("div")`
  display: flex;
  align-items: center;
  gap: 6px;
`;
const ForgotPassword = styled("p")`
  font: 400 14px Montserrat;
  color: #000000;
  text-decoration: none;
`;
const ResetPassword = styled("a")`
  font: 400 14px Montserrat;
  color: rgb(115, 22, 222);
`;
