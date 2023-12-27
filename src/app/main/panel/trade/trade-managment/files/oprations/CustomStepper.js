import PassengerInformation from "../../../temporary-submit/files/PassengerInformation";
import ServicesInformation from "../../../temporary-submit/files/ServicesInformation";
//stepper
import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import BaseInformation from "../../../temporary-submit/files/BaseInformation";
import ShowStatus from "../../../temporary-submit/files/ShowStaus";
//end stepper
const steps = ["مسیر/هتل/خدمات", "اطلاعات پایه مالی"];

const CustomStepper = (props) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  //variablee for store json in each part
  const [personsJSON, setPersonsJSON] = React.useState(
    props.action === "opration"
      ? {
          internal: props.refrence.internal,
          income: props.refrence.income,
          income_id: props.refrence.income_id,
          passengers: props.refrence.passengers.concat(props.addedPersons),
        }
      : {}
  );
  const [update, setUpdate] = React.useState(false);
  const [updateSells, setUpdateSells] = React.useState(false);
  function handleSetPersonsJSON(value) {
    setPersonsJSON(value);
  }

  const isStepOptional = (step) => {
    return step === -1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Stepper sx={{ marginTop: 5, marginBottom: 5 }} activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps = {};
            const labelProps = {};
            if (isStepOptional(index)) {
              labelProps.optional = (
                <Typography variant="caption">Optional</Typography>
              );
            }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {/* <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography> */}
            <Box display={activeStep == 0 ? "" : "none"}>
              <ServicesInformation
                handleNext={handleNext}
                handleBack={handleBack}
                personsJSON={personsJSON}
                handleSetPersonsJSON={handleSetPersonsJSON}
                update={update}
                setUpdate={setUpdate}
                action={props.action}
              />
            </Box>
            <Box display={activeStep == 1 ? "" : "none"}>
              <BaseInformation
                handleNext={handleNext}
                handleBack={handleBack}
                personsJSON={personsJSON}
                handleSetPersonsJSON={handleSetPersonsJSON}
                setUpdateSells={setUpdateSells}
                updateSells={updateSells}
                update={update}
                setUpdate={setUpdate}
                action={props.action}
                handleAddedItem={props.handleAddedItem}
              />
            </Box>
          </React.Fragment>
        )}
      </Box>
    </>
  );
};

export default CustomStepper;
