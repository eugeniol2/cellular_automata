import * as yup from "yup";
import { CaRuleType } from "../page";

export const simulationFormSchema = yup.object().shape({
  executionTime: yup
    .number()
    .required("Tempo de execução é obrigatório")
    .min(200, "Tempo mínimo de execução é 200ms")
    .max(1000, "Tempo máximo de execução é 1000ms"),

  caRule: yup.mixed<CaRuleType>().required("Regra CA é obrigatória"),

  initialPop: yup
    .number()
    .required("População inicial é obrigatória")
    .min(100, "População inicial mínima é 100")
    .max(400, "População inicial máxima é 400"),

  popTarget: yup
    .number()
    .required("Meta de população é obrigatória")
    .min(100, "Meta de população mínima é 100")
    .max(400, "Meta de população máxima é 400"),

  contagionRange: yup
    .number()
    .required("Alcance de contágio é obrigatório")
    .min(1, "Alcance de contágio mínimo é 1")
    .max(100, "Alcance de contágio máximo é 100"),

  infectionDuration: yup
    .number()
    .required("Duração da infecção é obrigatória")
    .min(1, "Duração mínima da infecção é 1"),

  naturalDeathRate: yup
    .number()
    .required("Taxa de morte natural é obrigatória")
    .min(0.1, "Taxa mínima de morte natural é 0.1%")
    .max(100, "Taxa máxima de morte natural é 100%"),

  virusDeathRate: yup
    .number()
    .required("Letalidade do vírus é obrigatória")
    .min(0.1, "Letalidade mínima do vírus é 0.1%")
    .max(100, "Letalidade máxima do vírus é 100%"),

  bornImmuneChance: yup
    .number()
    .required("Chance de imunidade ao nascer é obrigatória")
    .min(0.1, "Chance mínima de imunidade ao nascer é 0.1%")
    .max(100, "Chance máxima de imunidade ao nascer é 100%"),

  enableReproduction: yup
    .boolean()
    .required("Configuração de reprodução é obrigatória"),
});
