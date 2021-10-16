import React, { useState, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Grid from "@material-ui/core/Grid";

const PollsForm = ({ createPoll }) => {
  const { control, handleSubmit } = useForm();

  const onSubmit = useCallback(
    ({ title, hoursToExpiry, options }) => {
      // Convert hours to expiry to seconds
      const _hoursToExpiry = parseInt(hoursToExpiry, 10);
      const _secondsToExpiry = _hoursToExpiry * 3600;
      // Convert options string to an array
      const _options = options.split(" ");
      createPoll({ title, _secondsToExpiry, _options });
    },
    [createPoll]
  );

  return (
    <form style={{ marginTop: "30px" }} onSubmit={handleSubmit(onSubmit)}>
      <Grid container columns={{ sm: 12, md: 12 }}>
        <Grid item sm={12} md={12} className="form-item">
          <Controller
            name="title"
            control={control}
            defaultValue=""
            rules={{ required: "Title required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label="Title"
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
                className="text-field"
              />
            )}
          />
        </Grid>
        <Grid item sm={12} md={12} className="form-item">
          <Controller
            name="hoursToExpiry"
            control={control}
            defaultValue=""
            rules={{ required: "hoursToExpiry required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label="Expiry Time"
                placeholder="From 1 to 168 hours(1 week)"
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
                className="text-field"
              />
            )}
          />
        </Grid>
        <Grid item sm={12} md={12} className="form-item">
          <Controller
            name="options"
            control={control}
            defaultValue=""
            rules={{ required: "Options required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                label="Options"
                placeholder="Insert space between options"
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error ? error.message : null}
                className="text-field"
              />
            )}
          />
        </Grid>
        <Grid item sm={12} md={12} className="form-item">
          <button
            type="submit"
            onSubmit={handleSubmit}
            className="cta-button connect-wallet-button"
          >
            Create Poll
          </button>
        </Grid>
      </Grid>
    </form>
  );
};

export default PollsForm;
