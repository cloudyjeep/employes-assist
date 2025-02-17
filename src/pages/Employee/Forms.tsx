import { useForm, UseFormReturn } from "react-hook-form";
import { BoxFlex } from "../../components/Custom";
import { ReactNode, useEffect, useMemo, useRef, useTransition } from "react";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Divider,
  TextField,
} from "@mui/material";
import { MessageError } from "../../components/Validation";
import { useDataAPI } from "../../api/config";
import {
  apiDistrict,
  apiProvince,
  apiRegency,
  apiSubDistrict,
} from "../../api/location";
import { camelCase, isArray } from "../../lib/utils";
import { useDialog } from "../../components/Dialog";

interface State {
  nama: string;
  jalan: string;
  provinsi: string;
  kabupaten: string;
  kecamatan: string;
  kelurahan: string;
}

const mapLocation = new Map<keyof State, any>();

export const FormEmployee = ({
  title,
  onSubmit,
  defaultValues,
}: {
  title: ReactNode;
  onSubmit: (data: object) => Promise<boolean>;
  defaultValues?: State;
}) => {
  const [isPending, startTransition] = useTransition();

  const forms = useForm<State>({ defaultValues });
  const { register, handleSubmit, formState } = forms;
  const { errors } = formState;

  const dialog = useDialog({
    async onConfirm() {
      startTransition(async () => {
        const ok = await onSubmit({
          nama: forms.getValues("nama"),
          jalan: forms.getValues("nama"),
          provinsi: mapLocation.get("provinsi"),
          kabupaten: mapLocation.get("kabupaten"),
          kecamatan: mapLocation.get("kecamatan"),
          kelurahan: mapLocation.get("kelurahan"),
        });
        if (ok) mapLocation.clear();
      });
    },
  });

  useEffect(() => () => mapLocation.clear(), []);

  return (
    <>
      <dialog.content>
        <BoxFlex gap={0.5}>
          {`Save data employee `}
          <BoxFlex fontWeight={600}>{forms.getValues("nama")}</BoxFlex>
          {`? `}
        </BoxFlex>
      </dialog.content>
      <BoxFlex
        component="form"
        column
        gap={3}
        pb={2}
        px={1}
        onSubmit={handleSubmit(dialog.open)}
        // alignItems="flex-start"
      >
        <BoxFlex alignItems="center" gap={1.25} mb={-1}>
          {title}
        </BoxFlex>
        <Divider
          flexItem
          orientation="horizontal"
          sx={{ borderStyle: "dashed" }}
        />

        {/* Name */}
        <BoxFlex column gap={0.5} maxWidth={300}>
          <TextField
            {...register("nama", { required: "Required!" })}
            label="Full Name"
            placeholder="Enter full name"
            error={Boolean(errors.nama)}
            disabled={isPending}
          />
          <MessageError field={errors.nama} pl={1.75} />
        </BoxFlex>

        <BoxFlex gap={3} flexWrap="wrap">
          <InputLocation
            label="Province"
            placeholder="Select Province"
            api={apiProvince}
            name="provinsi"
            disabled={isPending}
            {...forms}
          />
          <InputLocation
            label="Regency"
            placeholder="Select Regency"
            api={apiRegency}
            name="kabupaten"
            parent="provinsi"
            disabled={isPending}
            {...forms}
          />
          <InputLocation
            label="District"
            placeholder="Select District"
            api={apiDistrict}
            name="kecamatan"
            parent="kabupaten"
            disabled={isPending}
            {...forms}
          />
          <InputLocation
            label="SubDistrict"
            placeholder="Select SubDistrict"
            api={apiSubDistrict}
            name="kelurahan"
            parent="kecamatan"
            disabled={isPending}
            {...forms}
          />
        </BoxFlex>

        {/* Street */}
        <BoxFlex column gap={0.5} maxWidth={300}>
          <TextField
            {...register("jalan", { required: "Required!" })}
            label="Street"
            placeholder="Enter street"
            error={Boolean(errors.jalan)}
            disabled={isPending}
            minRows={2}
            multiline
            sx={{
              "& .MuiInputBase-root > textarea": {
                pt: 2,
                pb: "0px !important",
              },
            }}
          />
          <MessageError field={errors.jalan} pl={1.75} />
        </BoxFlex>

        {/* Submit */}
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isPending}
          disableElevation
          sx={{ alignSelf: "flex-start", mt: 2, minWidth: 100 }}
        >
          {isPending ? <CircularProgress size={20} sx={{ my: 0.5 }} /> : "Save"}
        </Button>
      </BoxFlex>
    </>
  );
};

function InputLocation<T extends object = {}>({
  api,
  label,
  placeholder,
  name,
  parent,
  disabled,
  ...forms
}: {
  api: (...args: any) => string;
  label: string;
  placeholder: string;
  name: keyof State;
  parent?: keyof State;
  disabled: boolean;
} & UseFormReturn<State>) {
  let queryValue = "";

  if (parent) {
    forms.watch(parent);
    queryValue = forms.getValues(parent);
  }

  const { data, error: dataError } = useDataAPI<T[]>(() => api(queryValue));

  const payload = useMemo(() => {
    if (!isArray(data) || dataError) return [];
    return data.map((v) => ({
      id: Reflect.get(v, "id"),
      label: camelCase(Reflect.get(v, "name")),
    }));
  }, [data, dataError]);

  const field = forms.register(name, { required: "Required!" });
  const error = forms.formState.errors[name];
  const value = forms.getValues(name);
  const selected = payload.filter((v) => v.id == value)[0] ?? null;
  const ref = useRef<HTMLInputElement>(null);
  const refHide = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (forms.formState.isDirty) {
      forms.setValue(name, "");
    }
  }, [dataError, queryValue]);

  useEffect(() => {
    if (!forms.formState.isDirty && data?.length && value) {
      const item = data.filter((v) => Reflect.get(v, "id") == value)[0];
      if (item) {
        mapLocation.set(name, { ...item });
      }
    }
  }, [payload]);

  return (
    <>
      <BoxFlex column gap={0.5}>
        <TextField
          {...field}
          label={label}
          placeholder={placeholder}
          type="text"
          value={value}
          //   error={Boolean(errors[name])}
          error={Boolean(error)}
          disabled={Boolean(dataError) || disabled}
          inputRef={refHide}
          onFocus={() => {
            if (ref.current !== null) {
              ref.current.click();
            }
          }}
          sx={{
            height: "1px !important",
            minHeight: "1px !important",
            width: "1px !important",
            overflow: "hidden",
            position: "absolute",
            zIndex: -100,
            opacity: 0.1,
          }}
        />

        <Autocomplete
          id={`${name}-`}
          value={selected}
          onChange={(_, value) => {
            const val = String(value?.id || "");
            forms.setValue(name, val);
            if (val) {
              forms.clearErrors(name);
              mapLocation.set(name, {
                ...data?.filter((v) => Reflect.get(v, "id") == val)[0],
              });
            } else {
              forms.setError(name, { type: "required" });
            }
          }}
          options={payload}
          sx={{ width: 300, maxWidth: 300 }}
          // disabled={Boolean(dataError) || disabled}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                label={label}
                placeholder={placeholder}
                InputLabelProps={{ shrink: true }}
                inputRef={ref}
                error={Boolean(error)}
                sx={{
                  "& .MuiInputBase-root .MuiInputBase-input": {
                    pt: 2,
                    pb: 0.5,
                  },
                }}
              />
            );
          }}
        />
        <MessageError field={error} pl={1.75} />
      </BoxFlex>
    </>
  );
}
