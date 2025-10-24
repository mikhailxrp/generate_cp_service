"use client";
import { useState, useCallback, useRef } from "react";
import GraphCard from "./GraphCard";
import { updateTotalGenerationAction } from "@/app/actions/updateTotalGeneration";

export default function GraphCardWrapper({ graphData, id }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const savedValueRef = useRef(null);

  const handleTotalGenerationCalculated = useCallback(
    async (totalAnnualGeneration) => {
      if (!id || isUpdating || savedValueRef.current === totalAnnualGeneration)
        return;

      setIsUpdating(true);
      try {
        await updateTotalGenerationAction(id, totalAnnualGeneration);
        savedValueRef.current = totalAnnualGeneration;
      } catch (error) {
        console.error("Error saving total annual generation:", error);
      } finally {
        setIsUpdating(false);
      }
    },
    [id, isUpdating]
  );

  return (
    <GraphCard
      graphData={graphData}
      onTotalGenerationCalculated={handleTotalGenerationCalculated}
    />
  );
}
