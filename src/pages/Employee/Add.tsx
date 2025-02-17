import { Section } from "../../components/Custom";
import { Button, Typography } from "@mui/material";
import { ArrowLeftToLine, UserPlus } from "lucide-react";
import { fetchAPI } from "../../api/config";
import { apiEmployee } from "../../api/employee";
import { NavLink, useNavigate } from "react-router-dom";
import { FormEmployee } from "./Forms";

const EmployeeAdd = () => {
  const nav = useNavigate();

  return (
    <Section
      title="New Employee"
      action={
        <NavLink to="/">
          <Button>
            <ArrowLeftToLine style={{ paddingRight: 6 }} />
            {"Employee Data"}
          </Button>
        </NavLink>
      }
    >
      <FormEmployee
        title={
          <>
            <UserPlus />
            <Typography variant="h3" fontSize={16}>
              {"Add new employee"}
            </Typography>
          </>
        }
        onSubmit={async (data: object): Promise<boolean> => {
          const { ok } = await fetchAPI(apiEmployee(), "POST", data);
          if (ok) {
            nav("/");
          }
          return Boolean(ok);
        }}
      />
    </Section>
  );
};

export default EmployeeAdd;
