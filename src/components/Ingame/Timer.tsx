import React from "react";
import { LeftTime } from "./styles";

export interface TimerProps {
    timeLeft: string
}
export const Timer: React.FC<TimerProps> = ({timeLeft}: TimerProps) => {
    return (
        <LeftTime>남은시간: {timeLeft}</LeftTime>
    )
}