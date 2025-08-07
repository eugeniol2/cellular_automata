// validationSchema.ts
import * as yup from "yup";
import { CaRuleType } from "../page";

export const simulationFormSchema = yup.object().shape({
  executionTime: yup
    .number()
    .required("Execution time is required")
    .min(200, "Minimum execution time is 200ms")
    .max(1000, "Maximum execution time is 1000ms"),
  caRule: yup.mixed<CaRuleType>().required("CA Rule is required"),
  initialPop: yup
    .number()
    .required("Initial population is required")
    .min(100, "Minimum initial population is 100")
    .max(400, "Maximum initial population is 400"),
  popTarget: yup
    .number()
    .required("Population target is required")
    .min(100, "Minimum population target is 100")
    .max(400, "Maximum population target is 400"),
  contagionRange: yup
    .number()
    .required("Contagion range is required")
    .min(1, "Minimum contagion range is 1")
    .max(100, "Maximum contagion range is 100"),
  infectionDuration: yup
    .number()
    .required("Infection duration is required")
    .min(1, "Minimum infection duration is 1"),
  naturalDeathRate: yup
    .number()
    .required("Natural death rate is required")
    .min(0.1, "Minimum natural death rate is 0.1%")
    .max(100, "Maximum natural death rate is 100%"),
  virusDeathRate: yup
    .number()
    .required("Virus death rate is required")
    .min(0.1, "Minimum virus death rate is 0.1%")
    .max(100, "Maximum virus death rate is 100%"),
  bornImmuneChance: yup
    .number()
    .required("Born immune chance is required")
    .min(0.1, "Minimum born immune chance is 0.1%")
    .max(100, "Maximum born immune chance is 100%"),
  enableReproduction: yup
    .boolean()
    .required("Reproduction setting is required"),
});
