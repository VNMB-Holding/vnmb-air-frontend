"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TextField, Label, FieldError, toast } from "@heroui/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  // Validation rules
  const isEmailInvalid = email.length > 0 && !/\S+@\S+\.\S+/.test(email);
  const isPasswordInvalid = password.length > 0 && password.length < 6;

  return (
    <div className="relative h-dvh w-full flex flex-col justify-between overflow-hidden font-sans">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/airplane_wing.svg"
          alt="Airplane wing over clouds"
          fill
          priority
          className="object-cover object-center scale-x-[-1]"
        />
        {/* Soft gradient overlay for readability without making it too dark */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/45 via-transparent to-transparent" />
      </div>

      {/* Transparent Header */}
      <header className="z-10 w-full bg-transparent py-6 px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="inline-block">
          <Image
            src="/images/VNMB-AIR_logo.svg"
            alt="VNMB Air Logo"
            width={120}
            height={35}
            priority
            className="brightness-0 invert object-contain h-7 sm:h-8 w-auto"
          />
        </Link>
      </header>

      {/* Main Content Area */}
      <div className="z-10 flex flex-col md:flex-row items-center justify-center md:justify-between w-full max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-16 gap-12 md:gap-24 flex-grow overflow-hidden">
        {/* Left Side: Typography */}
        <div className="flex text-white text-left flex-col gap-4 max-w-lg self-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight leading-tight">
            Voe além.
          </h1>
          <p className="text-white/80 text-base md:text-lg font-light max-w-sm leading-relaxed">
            Aviação corporativa sem esforço.
          </p>
        </div>

        {/* Right Side: Login Card */}
        <div className="w-full max-w-[400px] animate-fade-in flex flex-col gap-4 mx-auto md:mx-0">
          {/* Glassmorphic Container */}
          <div className="backdrop-blur-3xl bg-white/[0.08] border border-white/10 rounded-[24px] overflow-hidden shadow-2xl w-full">
            {/* Form Fields */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (isEmailInvalid || isPasswordInvalid || !email || !password) {
                  toast.danger("Erro ao fazer login", {
                    description: "Por favor, preencha os campos corretamente antes de continuar.",
                  });
                  return;
                }
                toast.success("Login realizado com sucesso!", {
                  description: `Bem-vindo de volta! E-mail: ${email}`,
                });
              }}
              className="p-8 sm:p-10 flex flex-col gap-6"
            >
              {/* Welcome text */}
              <div className="flex flex-col gap-1.5 mb-2">
                <h2 className="text-xl font-medium text-white tracking-tight">Bem-vindo de volta</h2>
                <p className="text-xs text-white/50">Insira seus dados para acessar sua reserva.</p>
              </div>

              {/* Email Input */}
              <TextField
                isRequired
                type="email"
                value={email}
                onChange={setEmail}
                isInvalid={isEmailInvalid}
                className="flex flex-col gap-1.5 w-full"
              >
                <Label className="text-[9px] tracking-widest text-white/50 font-semibold uppercase">
                  E-mail
                </Label>
                <input
                  placeholder="john.doe@example.com"
                  className="w-full h-10 bg-transparent border-b border-white/20 focus:border-white/60 text-white placeholder:text-white/25 outline-none transition-all duration-200 text-sm font-light pb-1"
                />
                {isEmailInvalid && (
                  <FieldError className="text-[10px] text-red-400 mt-1 font-light">
                    Por favor, insira um e-mail válido.
                  </FieldError>
                )}
              </TextField>

              {/* Password Input */}
              <TextField
                isRequired
                type={isVisible ? "text" : "password"}
                value={password}
                onChange={setPassword}
                isInvalid={isPasswordInvalid}
                className="flex flex-col gap-1.5 w-full"
              >
                <Label className="text-[9px] tracking-widest text-white/50 font-semibold uppercase">
                  Senha
                </Label>
                <div className="relative">
                  <input
                    placeholder="••••••••"
                    className="w-full h-10 bg-transparent border-b border-white/20 focus:border-white/60 text-white placeholder:text-white/25 outline-none transition-all duration-200 text-sm font-light pb-1 pr-10"
                  />
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                    aria-label="toggle password visibility"
                  >
                    {isVisible ? (
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {isPasswordInvalid && (
                  <FieldError className="text-[10px] text-red-400 mt-1 font-light">
                    A senha deve conter pelo menos 6 caracteres.
                  </FieldError>
                )}
              </TextField>

              {/* Actions Row */}
              <div className="flex items-center justify-between -mt-2">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className="flex items-center gap-2.5 focus:outline-none group select-none"
                >
                  {/* Custom Apple-like Switch */}
                  <div
                    className={`relative w-8 h-4.5 rounded-full transition-colors duration-250 ease-in-out border border-white/5 ${
                      rememberMe ? "bg-blue-600" : "bg-white/10"
                    }`}
                  >
                    <div
                      className={`absolute top-[2px] left-[2px] w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-250 ease-in-out ${
                        rememberMe ? "translate-x-3.5" : "translate-x-0"
                      }`}
                    />
                  </div>
                  <span className="text-[11px] text-white/75 font-light leading-none">
                    Lembrar de mim
                  </span>
                </button>

                <Link
                  href="/forgot-password"
                  className="text-[11px] text-white/50 hover:text-white/80 transition-colors font-light leading-none"
                >
                  Esqueci minha senha?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-11 mt-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-medium tracking-wide text-sm transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-blue-500/35 flex items-center justify-center gap-2 group"
              >
                Entrar
              </button>
            </form>

            {/* Bottom info section */}
            <div className="bg-white/[0.02] border-t border-white/5 p-6 sm:px-8 flex flex-col gap-3 text-[11px] text-white/40 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <svg className="w-3.5 h-3.5 text-white/30 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 11.517 1.284l-.517-.264zm3.036-1.522a.75.75 0 10-1.072-1.05l1.072 1.05zM12 22.5c5.799 0 10.5-4.701 10.5-10.5S17.799 1.5 12 1.5 1.5 6.201 1.5 12 6.201 22.5 12 22.5z" />
                </svg>
                <p>
                  Você encontra o seu código de reserva no e-ticket enviado após a compra. O programa de bônus está ativo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="z-10 w-full text-center py-4 text-[9px] text-white/20 font-light tracking-widest uppercase">
        <Link href="/legal" className="hover:underline hover:text-white/50 transition-colors">
          aviso legal
        </Link>
        <span className="mx-3 text-white/10">|</span>
        <span>© 2026 vnmb air</span>
      </footer>
    </div>
  );
}
