"use client"

export default function Input({ value, onChange, placeholder, label, type = "text", ...resto }) {
    return (
        <div>
            <label htmlFor={label}>{label}</label>
            <input
                id={label}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                {...resto}
            />
        </div>
    )
}