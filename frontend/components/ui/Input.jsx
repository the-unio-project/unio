"use client"

import { useId } from "react";

export default function Input({ value, onChange, placeholder, label, type = "text", ...resto }) {
    const id = useId();

    return (
        <div>
            {label && <label htmlFor={id}>{label}</label>}
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                {...resto}
            />
        </div>
    )
}