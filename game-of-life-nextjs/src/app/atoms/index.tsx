import { atom } from "jotai";
import { Agent } from "../agents/agent";

export const agentsAtom = atom<Agent[]>([]);

const virusDeathsAtom = atom<number>(0);
const naturalDeathsAtom = atom<number>(0);
const reproductionCountAtom = atom<number>(0);

export const globalAtoms = {
  virusDeathsAtom,
  naturalDeathsAtom,
  reproductionCountAtom,
};
