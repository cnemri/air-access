import { atom } from "jotai";

export const descriptionAtom = atom("");
export const imageUrlsAtom = atom<string[]>([]);
export const visualAnalysisAtom = atom({});
export const finalReportAtom = atom({});
export const isLoadingPropertyAtom = atom(false);
export const isLoadingAnalysisAtom = atom(false);
export const isLoadingReportAtom = atom(false);
