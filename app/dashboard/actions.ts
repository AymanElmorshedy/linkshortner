"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createLink, deleteLink, updateLink } from "@/data/links";

type CreateLinkInput = {
  url: string;
};

type UpdateLinkInput = {
  linkId: string;
  url: string;
};

type DeleteLinkInput = {
  linkId: string;
};

const createLinkSchema = z.object({
  url: z.url(),
});

const updateLinkSchema = z.object({
  linkId: z.uuid(),
  url: z.url(),
});

const deleteLinkSchema = z.object({
  linkId: z.uuid(),
});

export async function createLinkAction(input: CreateLinkInput) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "You must be signed in to create a link." };
  }

  const parsedInput = createLinkSchema.safeParse(input);

  if (!parsedInput.success) {
    return { success: false, error: "Enter a valid URL, including https://." };
  }

  try {
    const link = await createLink(userId, parsedInput.data.url);
    revalidatePath("/dashboard");

    return { success: true, data: link };
  } catch {
    return {
      success: false,
      error: "We could not create that link. Please try again.",
    };
  }
}

export async function updateLinkAction(input: UpdateLinkInput) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "You must be signed in to edit a link." };
  }

  const parsedInput = updateLinkSchema.safeParse(input);

  if (!parsedInput.success) {
    return { success: false, error: "Enter a valid URL, including https://." };
  }

  try {
    const link = await updateLink(
      userId,
      parsedInput.data.linkId,
      parsedInput.data.url,
    );
    revalidatePath("/dashboard");

    return { success: true, data: link };
  } catch {
    return {
      success: false,
      error: "We could not update that link. Please try again.",
    };
  }
}

export async function deleteLinkAction(input: DeleteLinkInput) {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, error: "You must be signed in to delete a link." };
  }

  const parsedInput = deleteLinkSchema.safeParse(input);

  if (!parsedInput.success) {
    return { success: false, error: "That link could not be found." };
  }

  try {
    await deleteLink(userId, parsedInput.data.linkId);
    revalidatePath("/dashboard");

    return { success: true };
  } catch {
    return {
      success: false,
      error: "We could not delete that link. Please try again.",
    };
  }
}
