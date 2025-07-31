"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {Textarea} from "@/components/ui/textarea";

import {redirect} from "next/navigation";
import { createTarotReading, getUserDetails, sendGiftEmail, newReadingPermissions } from '@/lib/actions/companion.actions';

const formSchema = z.object({
    name: z.string().min(1, { message: 'Name is required.'}),
    age: z.string().min(2, { message: 'Minimum age is 18.'}),
    status: z.string().min(1, { message: 'What do you want to ask Seraphina?'}),
    isGift: z.string(),
    giftEmail: z.string().email("Please enter a valid email address").optional(),
})

const ReadingForm = () =>  {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            age: '',
            status: '',
            isGift: 'NO',
            giftEmail: '',
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        const userDetails = await getUserDetails();
            if (!userDetails) {
                redirect("/sign-in");
            }

            const userName = userDetails.name;
            const userEmail = userDetails.email;

        if (values.isGift === 'YES' && !values.giftEmail) {
            document.getElementById('errorLabel')!.innerText = "Please provide an email address for the gift recipient.";
            return;
        } else if (values.isGift === 'YES' && values.giftEmail?.trim().toLowerCase() === userEmail.trim().toLowerCase()) {
            document.getElementById('errorLabel')!.innerText = "You cannot send a gift to yourself.";
            return;
        }  else {
            document.getElementById('errorLabel')!.innerText = "";
        }
    
        const tarotReading = await createTarotReading(values.name, values.age, values.status, values.isGift === 'YES', values.giftEmail);

        if (!tarotReading) {
            document.getElementById('errorLabel')!.innerText = "Seraphina cannot read your Tarots at the moment. Please try again.";
            return;
        }
        
        if(!newReadingPermissions(userEmail, values.isGift === 'YES'))
        {
            if(values.isGift === 'YES')
            {
                document.getElementById('errorLabel')!.innerText = "You have exceeded the number of allowed gifts";
                return;
            }
            document.getElementById('errorLabel')!.innerText = "Sorry, you have exceeded the number of possible readings for the month. Why not upgrade to get more?.";
            return;
        }

        if(values.isGift === 'YES') {
            const sentMail = await sendGiftEmail(userName, values.name, tarotReading.id, values.giftEmail?.trim().toLowerCase() || "");
            if (!sentMail) {
                document.getElementById('errorLabel')!.innerText = "Failed to send gift reading. Please try again.";    
            } else {
                document.getElementById('errorLabel')!.innerText = "Seraphina has sent your gift reading to " + values.name + "!";
            }
        }
        else {
            redirect(`/readings/${tarotReading.id}`);
        }
    
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter your name or the person&quot;s name if it&quot;s a gift"
                                    {...field}
                                    className="input"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>What is your age?</FormLabel>
                            <FormControl>
                            <Input
                                    type="number"
                                    placeholder="48"
                                    {...field}
                                    className="input"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>What do you want the cards to tell you?</FormLabel>
                            <FormControl>
                            <Textarea
                                    placeholder="Remember: the cards do not predict the future"
                                    {...field}
                                    className="input"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isGift"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Is This a Gift?</FormLabel>
                            <FormControl>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger className="input capitalize">
                                        <SelectValue placeholder="Select the subject" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="NO">No</SelectItem>
                                        <SelectItem value="YES">Yes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="giftEmail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>If it&quot;s a gift, who do we have to send it to?</FormLabel>
                            <FormControl>
                            <Input
                                    type="text"
                                    placeholder="Ex. my.friend@mail.com"
                                    {...field}
                                    className="input"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormDescription>
                    By clicking &quot;&quot;Generate your Reading&quot;&quot;, you agree to our <a href="/terms-and-conditions" className="text-blue-500 underline" target="_blank">Terms and conditions</a>.  
                </FormDescription>
                <Button type="submit" className="w-full cursor-pointer">Generate your Reading</Button>
            </form>
            <label id="errorLabel" className="text-2xl text-red-600 font-bold" ></label>
        </Form>
    )
};

export default ReadingForm;