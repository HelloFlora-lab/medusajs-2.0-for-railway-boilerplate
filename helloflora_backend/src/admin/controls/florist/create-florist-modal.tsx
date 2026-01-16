import { useEffect, useState } from "react"
import {
  FocusModal,
  Heading,
  Input,
  Select,
  Textarea,
  Label,
  Button,
  Text,
  toast,
} from "@medusajs/ui"

import { ReateStars } from "../../components/rate-stars"


interface CreateFloristModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<void>
}

interface RateValue {
    label: string;
    value: number;
  }

const floristRate : RateValue[] = [
        { label: 'Zero', value: 0 },
        { label: 'Uno', value: 1 },
        { label: 'due', value: 2 },
        { label: 'Tre', value: 3 },
        { label: 'Quattro', value: 4 },
        { label: 'Cinque', value: 5 },
];


export const CreateFloristModal = ({
  open,
  onOpenChange,
  onSubmit,
}: CreateFloristModalProps) => {

    const [isLoading, setIsLoading] = useState(false)

    const [name, setName] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [county, setCounty] = useState("")
    const [country, setCountry] = useState("")
    const [zipCode, setZipCode] = useState("")
    const [mainPhone, setMainPhone] = useState("")
    const [secondPhone, setSecondPhone] = useState("")
    const [email, setEmail] = useState("")
    const [note, setNote] = useState("")
    const [closeTtime, setCloseTime] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [imageUrl, setImageUrl] = useState("")
    const [iban, setIban] = useState("")
        
    const [rate, setRate] = useState(0);

    const [rateSelect, setRateSelect] = useState("0");


    useEffect(() => {
        const convertedNumber = parseInt(rateSelect, 10);

        if (!isNaN(convertedNumber)) {
            setRate(convertedNumber);
        } else if (rateSelect === "") {  
            setRate(0);
        }
    }, [rateSelect]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name.trim()) {
            toast.error("Florist name is required")
        return
        }

                
        if (!address.trim()) {
            toast.error("Florist address is required")
        return
        }

        if (!city.trim()) {
            toast.error("Florist city is required")
        return
        }

        if (!county.trim()) {
            toast.error("Florist county is required")
        return
        }

        if (!country.trim()) {
            toast.error("Florist country is required")
            return
        }

        if (!zipCode.trim()) {
            toast.error("Florist ZipCode is required")
            return
        }

        if (!mainPhone.trim()) {
            toast.error("Florist Main Phone is required")
        return
        }

        setIsLoading(true)
        try {
        await onSubmit({
            name: name.trim(),
            company_name: companyName.trim()|| undefined,
            address: address.trim(),
            city: address.trim(),
            county: county.trim(),
            country: country.trim(),
            zip_code: zipCode.trim(),
            main_phone: mainPhone.trim(),
            second_phone: secondPhone.trim()|| undefined,
            email: email.trim()|| undefined,
            note: note.trim()|| undefined,
            close_time: closeTtime.trim()|| undefined,
            is_open: isOpen|| undefined,
            image_url: imageUrl.trim()|| undefined,
            iban: iban.trim()|| undefined,
            rate: rate,
            //florist_status: floristStatus
            florist_status: "pending"
            
        })
        handleCloseModal()
        } catch (error: any) {
        toast.error(error.message)
        } finally {
        setIsLoading(false)
        }
    }

    const handleCloseModal = () => {
      setName("")
      setCompanyName("")
      setAddress("")
      setCity("")
      setCounty("")
      setCountry("")
      setZipCode("")
      setMainPhone("")
      setSecondPhone("")
      setEmail("")
      setNote("")
      setCloseTime("")
      setIsOpen(false)
      setImageUrl("")
      setIban("")
      setRate(0)
      setCloseTime("")
      onOpenChange(false)
    }

     return (
    <FocusModal open={open} onOpenChange={handleCloseModal}>
         <FocusModal.Content>
            <FocusModal.Header className="justify-start" />
            <FocusModal.Body className="flex flex-col overflow-hidden">
                <form onSubmit={handleSubmit} className="flex h-full flex-col">
                    
                    <div className="flex-1 overflow-y-auto">
                        <div className="flex flex-col items-center py-16 ">
                            <div className="flex w-full max-w-[720px] flex-col gap-y-8">
                                <div className=" ">
                                    <Heading level="h1">Create Florist</Heading>
                                    <Text size="small" className="text-ui-fg-subtle" >Create a new florist</Text>

                                </div>

                                <div className="flex-1 flex size-full flex-col pt-5 gap-y-6">
                                
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 ">
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter florist name"
                                    />
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="company name">Company 
                                        <span className="text-ui-fg-muted txt-compact-small"> (Optional)</span>
                                    </Label>
                                    <Input
                                        id="comanyname"
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder="Enter comany name"
                                    />
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="Status">Status</Label>
                                    {/* 
                                    <Select onValueChange={setFloristStatus} value={floristStatus}>
                                        <Select.Trigger>
                                        <Select.Value placeholder="Select status" />
                                        </Select.Trigger>
                                        <Select.Content>
                                        {Object.values(FloristStatus).map(value =>
                    
                                        <Select.Item key={value} value={value} className="capitalize">
                                            {value}
                                        </Select.Item>
                                            )
                                        }
                                        
                                        </Select.Content>
                                    </Select>
                                    */}
                                </div>

                                </div>


                            <div className="py-5">
                                <div className="flex flex-col space-y-2 pb-4">
                                <Label htmlFor="address">
                                Address
                                </Label>
                                <Textarea
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    placeholder="Enter address"
                                    rows={3}
                                />
                                </div>
                            
                                <div className="grid grid-cols-4 gap-4 md:grid-cols-4">
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="name">Zip code</Label>
                                    <Input
                                        id="zipcode"
                                        value={zipCode}
                                        onChange={(e) => setZipCode(e.target.value)}
                                        placeholder="Enter florist ZipCode"
                                    />
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="name">City</Label>
                                    <Input
                                        id="city"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="Enter florist city"
                                    />
                                </div>


                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="name">County</Label>
                                    <Input
                                        id="name"
                                        value={county}
                                        onChange={(e) => setCounty(e.target.value)}
                                        placeholder="Enter florist county"
                                    />
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="name">Country</Label>
                                    <Input
                                        id="country"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        placeholder="Enter florist country"
                                    />
                                </div>
                            </div>

                            </div>

                            <div className="grid grid-cols-3 gap-4 md:grid-cols-3 py-5">
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="name">Main phone</Label>
                                    <Input
                                    id="mainphone"
                                    value={mainPhone}
                                    onChange={(e) => setMainPhone(e.target.value)}
                                    placeholder="Enter florist main phone"
                                    />
                                </div>

                            <div className="flex flex-col space-y-2">
                                    <Label htmlFor="name">Secondary phone
                                    <span className="text-ui-fg-muted txt-compact-small"> (Optional)</span>
                                    </Label>
                                    <Input
                                    id="secondaryphone"
                                    value={secondPhone}
                                    onChange={(e) => setSecondPhone(e.target.value)}
                                    placeholder="Enter florist secondary Phone"
                                    />
                                </div>


                            <div className="flex flex-col space-y-2">
                                    <Label htmlFor="name">Email
                                    <span className="text-ui-fg-muted txt-compact-small"> (Optional)</span>
                                    </Label>
                                    <Input
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter florist Email"
                                    />
                                </div>

                            </div>

                            <div className="grid grid-cols-3 gap-4 md:grid-cols-3">
                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="name">Close time</Label>
                                    <Input
                                        id="closetime"
                                        value={closeTtime}
                                        onChange={(e) => setCloseTime(e.target.value)}
                                        placeholder="Enter florist closetime"
                                    />
                                </div>

                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="name">Iban</Label>
                                    <Input
                                        id="iban"
                                        value={iban}
                                        onChange={(e) => setIban(e.target.value)}
                                        placeholder="Enter florist Iban"
                                    />
                                </div>


                                <div className="flex flex-col space-y-2">
                                    <Label htmlFor="name">Trust</Label>
                                    
                                    
                                    <Select onValueChange={setRateSelect} value={rateSelect}>
                                        <Select.Trigger>
                                        <Select.Value placeholder="Select trust value" />
                                        </Select.Trigger>
                                        <Select.Content>

                                        {floristRate.map((option) => (
                                            
                                            <Select.Item key={option.value} value={option.value.toString()} className="capitalize">
                                            <ReateStars repeatCount={option.value} maxRate={floristRate.length} />

                                        </Select.Item>
                                        ))}
                                        
                                        </Select.Content>
                                    </Select>
                                    
                                </div>

                                
                            </div>

                            <div className="py-5">
                                <div className="flex flex-col space-y-2">
                                <Label htmlFor="address">
                                Note
                                <span className="text-ui-fg-muted txt-compact-small"> (Optional)</span>
                                </Label>
                                <Textarea
                                    id="note"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Enter Note"
                                    rows={3}
                                />
                                </div>
                            </div>


                            </div>
                        </div>
                        </div>
                    </div>
                    <FocusModal.Footer className="border-ui-border-base flex items-center justify-end gap-x-2 border-t p-4">
                    <Button
                        variant="primary"
                        onClick={handleCloseModal}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isLoading}
                        disabled={!name.trim() }
                    >
                        Create Florist
                    </Button>
                    </FocusModal.Footer>
              </form>
            </FocusModal.Body>
         </FocusModal.Content>
    </FocusModal>
     )
}
