import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  IconButton,
  InputAdornment,
  Button,
  CircularProgress,
  colors,
} from "@mui/material";
import { apiEmployee, Employee } from "../../api/employee";
import { BoxFlex, Section } from "../../components/Custom";
import { camelCase } from "../../lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useIsMobile, useDataPagination } from "../../lib/hook";
import { useCallback, useRef, useTransition } from "react";
import { NavLink } from "react-router-dom";
import { useDialog } from "../../components/Dialog";
import { fetchAPI } from "../../api/config";

export default function EmployeeData() {
  const refDelete = useRef<Partial<Employee>>({});
  const [isPending, startTransition] = useTransition();

  const dialog = useDialog({
    async onConfirm() {
      startTransition(async () => {
        await fetchAPI(`${apiEmployee()}/${refDelete.current.id}`, "DELETE");
        refDelete.current = {};
      });
    },
  });

  return (
    <>
      <dialog.content>
        <BoxFlex gap={0.5}>
          {`Delete employee `}
          <BoxFlex fontWeight={600}>{refDelete.current.nama}</BoxFlex>
          {`? `}
        </BoxFlex>
      </dialog.content>
      {isPending ? (
        <BoxFlex gap={0.5} alignItems="center">
          {"Deleting employee:"}
          <BoxFlex fontWeight={600}>{refDelete.current.nama}</BoxFlex>
          {"..."}
          <CircularProgress size={14} />
        </BoxFlex>
      ) : (
        <ListData
          onDelete={(employee) => {
            refDelete.current = { ...employee };
            dialog.open();
          }}
        />
      )}
    </>
  );
}

const ListData: React.FC<{ onDelete: (e: Employee) => void }> = ({
  onDelete,
}) => {
  const {
    data,
    empty,
    isLoading,
    search,
    queries,
    next,
    prev,
    page,
    position,
  } = useDataPagination<Employee, { nama: string }>(apiEmployee);

  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      search({ nama: e.target.value });
    },
    [search]
  );

  const mobile = useIsMobile();

  const pagination = (
    <BoxFlex flex={1} alignItems="center" justifyContent="flex-end">
      <IconButton {...prev}>
        <ChevronLeft />
      </IconButton>
      <BoxFlex gap={0.5}>
        <Typography fontSize={12} variant="body1" sx={{ opacity: 0.7 }}>
          {"Page"}
        </Typography>
        <Typography fontSize={12} variant="body1" fontWeight={600}>
          {page}
        </Typography>
      </BoxFlex>
      <IconButton {...next}>
        <ChevronRight />
      </IconButton>
    </BoxFlex>
  );

  return (
    <Section
      title="Employee Data"
      action={
        <NavLink to="/add">
          <Button>
            <UserPlus style={{ paddingRight: 6 }} />
            {"New Employee"}
          </Button>
        </NavLink>
      }
    >
      <BoxFlex
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
      >
        <TextField
          variant="standard"
          placeholder="Search empoyee"
          InputLabelProps={{ shrink: false }}
          size="small"
          sx={{
            minWidth: 260,
            "& .MuiInputBase-root": { pt: 0 },
            "& .MuiInputBase-root::before": { borderBottom: 0 },
            "& .MuiInputBase-root::after": { borderBottom: 0 },
            "& .MuiInputBase-input": { pb: `4px !important` },
          }}
          value={queries.nama}
          onChange={onSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ pb: 0.5 }}>
                <Search height={18} />
              </InputAdornment>
            ),
          }}
        />
        {pagination}
      </BoxFlex>
      <TableContainer
        component={Paper}
        sx={{ bgcolor: "transparent" }}
        elevation={0}
      >
        <Table
          sx={{
            // minWidth: 650,
            "& tr > th": { fontWeight: 600 },
            "& tr:last-child > td": { border: 0 },
          }}
        >
          {!mobile && (
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Employe</TableCell>
                <TableCell colSpan={2}>Adress</TableCell>
              </TableRow>
            </TableHead>
          )}
          <TableBody
            sx={
              mobile
                ? {
                    display: "block",
                    "& .MuiTableRow-root": {
                      display: "flex",
                      flexDirection: "column",
                      borderBottom: `1px dashed ${colors.grey[300]}`,
                      "& .MuiTableCell-root": {
                        px: 0,
                        py: 0.5,
                        border: "none",
                      },
                    },
                  }
                : undefined
            }
          >
            {(isLoading && empty) || empty ? (
              <TableRow>
                <TableCell component="th" scope="row" colSpan={4}>
                  <Typography
                    variant="caption"
                    textAlign="center"
                    fontStyle={isLoading ? "italic" : undefined}
                    sx={{ opacity: isLoading ? 0.7 : 1 }}
                  >
                    {isLoading ? "Loading.." : "Data Kosong"}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, i) => (
                <TableRow key={row.id}>
                  <TableCell>{`${position(i)}.`}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{row.nama}</TableCell>
                  <TableCell>
                    <BoxFlex>{row.jalan}</BoxFlex>
                    <BoxFlex>
                      {[
                        row.kelurahan?.name,
                        row.kecamatan?.name,
                        row.kabupaten?.name,
                        row.provinsi?.name,
                      ]
                        .filter((v) => v)
                        .map(camelCase)
                        .join(", ")}
                    </BoxFlex>
                  </TableCell>
                  <TableCell sx={{ textAlign: "right" }}>
                    <NavLink to={`/edit/${row.id}`}>
                      <IconButton>
                        <Edit />
                      </IconButton>
                    </NavLink>
                    <IconButton onClick={() => onDelete(row)}>
                      <Trash2 />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {data.length ? pagination : null}
    </Section>
  );
};
