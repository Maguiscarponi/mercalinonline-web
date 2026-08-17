"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/products";

export default function ProductForm({
  action,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: Product;
}) {
  const [featureGroupsJson, setFeatureGroupsJson] = useState(
    JSON.stringify(defaultValues?.featureGroups ?? [{ title: "", items: [""] }], null, 2)
  );
  const [jsonError, setJsonError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    try {
      JSON.parse(featureGroupsJson);
      setJsonError("");
    } catch {
      e.preventDefault();
      setJsonError("El JSON de funcionalidades no es válido.");
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit} className="admin-card mt-6 grid max-w-2xl gap-5 p-6">
      <Field label="Imagen del producto (se muestra en la card y en la ficha)">
        {defaultValues?.imageUrl && (
          <div className="mb-2">
            <Image
              src={defaultValues.imageUrl}
              alt=""
              width={160}
              height={120}
              className="rounded-lg border border-black/10 object-cover"
            />
          </div>
        )}
        <input type="hidden" name="existingImageUrl" value={defaultValues?.imageUrl ?? ""} />
        <input type="file" name="image" accept="image/*" className="admin-input" />
      </Field>
      <Field label="Slug (para la URL, ej. mercalin)">
        <input name="slug" required defaultValue={defaultValues?.slug} className="admin-input" />
      </Field>
      <Field label="Nombre">
        <input name="name" required defaultValue={defaultValues?.name} className="admin-input" />
      </Field>
      <Field label="Tagline (una línea)">
        <input name="tagline" required defaultValue={defaultValues?.tagline} className="admin-input" />
      </Field>
      <Field label="Descripción">
        <textarea name="description" required rows={4} defaultValue={defaultValues?.description} className="admin-input" />
      </Field>
      <Field label="Precio (ARS, pago único)">
        <input
          name="priceArs"
          type="number"
          min={0}
          required
          defaultValue={defaultValues?.priceArs}
          className="admin-input"
        />
      </Field>
      <Field label="Ideal para (separado por comas)">
        <input
          name="idealFor"
          defaultValue={defaultValues?.idealFor.join(", ")}
          placeholder="Kioscos, Almacenes, Ferreterías"
          className="admin-input"
        />
      </Field>
      <Field label="Link de descarga del instalador (opcional por ahora)">
        <input name="downloadUrl" defaultValue={defaultValues?.downloadUrl ?? ""} className="admin-input" />
      </Field>
      <Field label='Funcionalidades (JSON: [{"title": "...", "items": ["..."]}])'>
        <textarea
          value={featureGroupsJson}
          onChange={(e) => setFeatureGroupsJson(e.target.value)}
          rows={10}
          className="admin-input font-mono text-xs"
        />
        <input type="hidden" name="featureGroupsJson" value={featureGroupsJson} />
        {jsonError && <p className="mt-2 text-sm text-brand">{jsonError}</p>}
      </Field>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="active" defaultChecked={defaultValues?.active ?? true} />
        Publicado (visible en el sitio)
      </label>
      <button type="submit" className="admin-btn admin-btn-primary mt-2 w-fit px-6 py-3 text-sm">
        Guardar
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="tag-numbered block text-xs text-foreground/40">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
