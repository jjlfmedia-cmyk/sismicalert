import { db } from "@/db";
import { contacts } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, messageType, message } = body;

    if (!name || !email || !messageType || !message) {
      return Response.json(
        { ok: false, error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { ok: false, error: "Email inválido" },
        { status: 400 }
      );
    }

    if (message.length > 5000) {
      return Response.json(
        { ok: false, error: "El mensaje es demasiado largo (máximo 5000 caracteres)" },
        { status: 400 }
      );
    }

    await db.insert(contacts).values({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      messageType: messageType.trim(),
      message: message.trim(),
    });

    return Response.json({
      ok: true,
      message: "Mensaje enviado correctamente. Responderemos en 24-72 horas.",
    });
  } catch {
    return Response.json(
      { ok: false, error: "Error al enviar el mensaje. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
