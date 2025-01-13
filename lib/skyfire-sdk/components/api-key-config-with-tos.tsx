"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

import { updateError, updateSkyfireAPIKey } from "../context/action"
import { useSkyfire, useSkyfireTOSAgreement } from "../context/context"
import { setApiKeyToLocalStorage } from "../util"

interface TOSObject {
  name: string
  tos?: string
  link?: string
}

interface APIKeyConfigWithTOSProps {
  error?: AxiosError | null
  tos: TOSObject
}

const FormSchema = z.object({
  apikey: z
    .string()
    .refine(
      (value) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          value ?? ""
        ),
      "Invalid API key format"
    ),
  tosAgreed: z.boolean().refine((value) => value === true, {
    message: "You must agree to the Terms of Service",
  }),
})

export function APIKeyConfigWithTOS({ error, tos }: APIKeyConfigWithTOSProps) {
  const { dispatch } = useSkyfire()
  const { tosAgreed, setTOSAgreement } = useSkyfireTOSAgreement()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      apikey: "",
      tosAgreed: tosAgreed,
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = setApiKeyToLocalStorage(data.apikey)
    dispatch(updateError(null))
    if (res) {
      dispatch(updateSkyfireAPIKey(data.apikey))
      setTOSAgreement(data.tosAgreed)
    }
  }

  return (
    <Card className="bg-transparent border-none p-0 shadow-none">
      <CardHeader>
        <CardTitle>Skyfire API Key Configuration</CardTitle>
        <CardDescription>
          {error ? (
            <p className="text-primary">
              It seems that your API key was invalid. Please re-enter. Make sure
              to copy from the correct environment.
            </p>
          ) : (
            "If you do not have an API Key, please visit app.skyfire.xyz to create."
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="apikey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your API Key" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tosAgreed"
              render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {tos.link && !tos.tos ? (
                        <>
                          I agree to the{" "}
                          <a
                            href={tos.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary underline"
                          >
                            {tos.name}
                          </a>
                        </>
                      ) : (
                        <>I agree to the {tos.name}</>
                      )}
                    </FormLabel>
                  </div>
                  {tos.tos && (
                    <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                      <div className="text-sm">{tos.tos}</div>
                    </ScrollArea>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="bg-secondary">
              Save and Continue
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
