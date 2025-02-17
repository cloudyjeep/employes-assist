import { BoxFlex, Section } from "../../components/Custom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { ArrowLeftToLine, UserRoundPen } from "lucide-react";
import { fetchAPI, useDataAPI } from "../../api/config";
import { apiEmployee, Employee } from "../../api/employee";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { FormEmployee } from "./Forms";

const EmployeeEdit = () => {
  const nav = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useDataAPI<Employee>(
    () => `${apiEmployee()}/${id}`
  );

  const notFound = !(Boolean(data) && typeof data == "object");

  return (
    <Section
      title={
        <>
          {"Employee: "}
          <Box component="span" fontWeight={600}>
            {data?.nama}
          </Box>
        </>
      }
      action={
        <NavLink to="/">
          <Button>
            <ArrowLeftToLine style={{ paddingRight: 6 }} />
            {"Employee Data"}
          </Button>
        </NavLink>
      }
    >
      {isLoading || notFound ? (
        <BoxFlex gap={0.5} alignItems="center">
          {isLoading ? "Loading..." : "Employee not found"}
          {isLoading && <CircularProgress size={14} />}
        </BoxFlex>
      ) : (
        <FormEmployee
          title={
            <>
              <UserRoundPen />
              <Typography variant="h3" fontSize={16}>
                {"Edit data employe "}
              </Typography>
            </>
          }
          defaultValues={{
            nama: data.nama,
            jalan: data.jalan,
            provinsi: data.provinsi?.id ?? "",
            kabupaten: data.kabupaten?.id ?? "",
            kecamatan: data.kecamatan?.id ?? "",
            kelurahan: data.kelurahan?.id ?? "",
          }}
          onSubmit={async (data: object): Promise<boolean> => {
            const { ok } = await fetchAPI(
              `${apiEmployee()}/${id}`,
              "PUT",
              data
            );

            if (ok) {
              nav("/");
            }
            return Boolean(ok);
          }}
        />
      )}
    </Section>
  );
};

export default EmployeeEdit;
