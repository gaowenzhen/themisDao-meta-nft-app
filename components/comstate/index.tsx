import { useState, useEffect } from "react";
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

export default function ComState(props:any) {
    let curtstep = props.curtstep
    
    const getSteps = () => {
        return ['whitelist', 'public sale', 'end'];
      }
    
      const [activeStep, setActiveStep] = useState(-1);
      const steps = getSteps();

      useEffect(()=>{
        if (curtstep !== -1) {
          setActiveStep(curtstep)
        }
      },[curtstep])

  return (<div className="comstatebox">
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
  </div>);
};

