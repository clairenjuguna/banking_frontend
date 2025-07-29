"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useAuth } from "./auth-provider"
import { useToast } from "../hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { CheckCircle, Send } from "lucide-react"

interface TransferModalProps {
  isOpen: boolean
  onClose: () => void
}

const mockUsers = [
  { id: "2", name: "Jane Smith", email: "jane@example.com" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com" },
  { id: "4", name: "Alice Brown", email: "alice@example.com" },
]

export function TransferModal({ isOpen, onClose }: TransferModalProps) {
  const { user, updateBalance } = useAuth()
  const { toast } = useToast()
  const [step, setStep] = useState<"form" | "confirmation" | "receipt">("form")
  const [formData, setFormData] = useState({
    receiverId: "",
    receiverName: "",
    amount: "",
    notes: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleReceiverSelect = (userId: string) => {
    const selectedUser = mockUsers.find((u) => u.id === userId)
    if (selectedUser) {
      setFormData({
        ...formData,
        receiverId: userId,
        receiverName: selectedUser.name,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    const amount = Number.parseFloat(formData.amount)

    if (amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    if (amount > user.balance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance for this transfer",
        variant: "destructive",
      })
      return
    }

    if (!formData.receiverId) {
      toast({
        title: "Select recipient",
        description: "Please select a recipient for the transfer",
        variant: "destructive",
      })
      return
    }

    setStep("confirmation")
  }

  const confirmTransfer = async () => {
    if (!user) return

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const amount = Number.parseFloat(formData.amount)
      updateBalance(user.id, user.balance - amount)

      setStep("receipt")

      toast({
        title: "Transfer successful",
        description: `KES ${amount.toLocaleString()} sent to ${formData.receiverName}`,
      })
    } catch (error) {
      toast({
        title: "Transfer failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetModal = () => {
    setStep("form")
    setFormData({
      receiverId: "",
      receiverName: "",
      amount: "",
      notes: "",
    })
    onClose()
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-md">
        {step === "form" && (
          <>
            <DialogHeader>
              <DialogTitle>Transfer Money</DialogTitle>
              <DialogDescription>Send money to another user securely</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="receiver">Select Recipient</Label>
                <Select onValueChange={handleReceiverSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose recipient" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers
                      .filter((u) => u.id !== user.id)
                      .map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name} ({u.email})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (KES)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
                <p className="text-sm text-gray-600">Available balance: KES {user.balance.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add a note for this transfer"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="flex space-x-2">
                <Button type="button" variant="outline" onClick={resetModal} className="flex-1 bg-transparent">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Continue
                </Button>
              </div>
            </form>
          </>
        )}

        {step === "confirmation" && (
          <>
            <DialogHeader>
              <DialogTitle>Confirm Transfer</DialogTitle>
              <DialogDescription>Please review the transfer details before confirming</DialogDescription>
            </DialogHeader>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transfer Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">From:</span>
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{formData.receiverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-lg">KES {Number.parseFloat(formData.amount).toLocaleString()}</span>
                </div>
                {formData.notes && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Notes:</span>
                    <span className="font-medium">{formData.notes}</span>
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">New Balance:</span>
                    <span className="font-medium">
                      KES {(user.balance - Number.parseFloat(formData.amount)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => setStep("form")} className="flex-1">
                Back
              </Button>
              <Button onClick={confirmTransfer} disabled={isLoading} className="flex-1">
                {isLoading ? "Processing..." : "Confirm Transfer"}
              </Button>
            </div>
          </>
        )}

        {step === "receipt" && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                Transfer Successful
              </DialogTitle>
              <DialogDescription>Your money has been sent successfully</DialogDescription>
            </DialogHeader>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600">Transaction Receipt</CardTitle>
                <CardDescription>Transaction ID: TXN{Date.now()}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Sent:</span>
                  <span className="font-bold">KES {Number.parseFloat(formData.amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">To:</span>
                  <span className="font-medium">{formData.receiverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-medium">Completed</span>
                </div>
              </CardContent>
            </Card>
            <Button onClick={resetModal} className="w-full">
              Done
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
