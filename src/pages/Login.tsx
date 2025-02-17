import {
  Box,
  Button,
  CircularProgress,
  colors,
  TextField,
  Typography,
} from "@mui/material";
import { BoxFlex } from "../components/Custom";
import { SubmitHandler, useForm } from "react-hook-form";
import { MessageError } from "../components/Validation";
import { useCallback, useState, useTransition } from "react";
import { checkSession } from "../api/user";
import { actions } from "../lib/store";
import { useDispatch } from "react-redux";

interface FormState {
  username: string;
  email: string;
}

const FormLogin: FC<{}> = () => {
  const dispatch = useDispatch();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  // form state
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormState>();

  const onSubmit: SubmitHandler<FormState> = useCallback(
    (data) => {
      startTransition(async () => {
        setMessage("");
        try {
          const user = await checkSession(data.username, data.email);
          dispatch(actions.setSession(user));
        } catch (message) {
          setMessage(message as string);
        }
      });
    },
    [startTransition, setMessage, dispatch]
  );

  return (
    <BoxFlex
      component="form"
      column
      gap={3}
      p={3}
      onSubmit={handleSubmit(onSubmit)}
      maxWidth={400}
      width={"100%"}
    >
      {/* Welcom */}
      <BoxFlex column gap={2}>
        <Box maxWidth={150} component="img" src="/logo.png" alt="logo" />
        
        <Typography variant="h1" fontSize={20}>
          {"Employee Management"}
        </Typography>

        <Typography variant="h2" fontSize={14}>
          {"Login with your account"}
        </Typography>
      </BoxFlex>

      {/* Username */}
      <BoxFlex column gap={0.5}>
        <TextField
          label="Email"
          placeholder="Enter your username or email"
          {...register("username", { required: "required!" })}
          error={Boolean(errors.username)}
          disabled={isPending}
        />
        <MessageError field={errors.username} pl={1.75} />
      </BoxFlex>

      {/* Password */}
      <BoxFlex column gap={0.5}>
        <TextField
          type="password"
          label="Password"
          placeholder="Enter your password"
          {...register("email", { required: "required!" })}
          error={Boolean(errors.email)}
          disabled={isPending}
        />
        <MessageError field={errors.email} pl={1.75} />
      </BoxFlex>

      {/* Submit */}
      <Button
        type="submit"
        variant="outlined"
        size="large"
        disabled={isPending}
      >
        {isPending ? (
          <CircularProgress size={20} sx={{ my: 0.5 }} />
        ) : (
          "Sign In"
        )}
      </Button>

      <Typography variant="caption" color="error" fontSize={14}>
        {message}
      </Typography>
    </BoxFlex>
  );
};

export default function () {
  return (
    <BoxFlex
      width="100%"
      maxWidth={1366}
      px={2}
      gap={2}
      alignSelf="center"
      flexWrap="wrap"
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <BoxFlex
        // boxShadow={3}
        border={`1px solid ${colors.indigo[100]}`}
        borderRadius={3}
        width="100%"
        minHeight={500}
        alignItems="center"
        maxWidth={1000}
        justifyContent="space-around"
        px={2}
        flexWrap="wrap"
        //
      >
        <FormLogin />
        <Box
          maxWidth={300}
          component="img"
          src="/orna.png"
          alt="cover"
          //
        />
      </BoxFlex>
    </BoxFlex>
  );
}
