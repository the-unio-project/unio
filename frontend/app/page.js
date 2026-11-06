"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";


export default function Home() {
  const [nome, setNome] = useState("");
  const [nomeSalvo, setNomeSalvo] = useState("");

  return (
      <Card>
        <Input 
          label="Nome"
          placeholder="Digite seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <Button onClick={() => setNomeSalvo(nome)}>Salvar</Button>
        {nomeSalvo && <p>Nome salvo: {nomeSalvo}</p>}
      </Card>

  );
}