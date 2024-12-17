import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { Review, Developer } from "../types";

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: Partial<Review>) => Promise<Review | undefined>;
  review?: Review;
  developerId: number;
  developer: Developer;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  review,
  developer,
}) => {
  const [formData, setFormData] = React.useState<Partial<Review>>({
    date: review?.date || new Date().toISOString().split("T")[0],
    codeQuality: review?.codeQuality || 3,
    communication: review?.communication || 3,
    teamwork: review?.teamwork || 3,
    delivery: review?.delivery || 3,
    strengths: review?.strengths || [],
    improvements: review?.improvements || [],
    notes: review?.notes || "",
  });

  const handleChange = (
    field: keyof Review,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ ...formData, developer });
    onClose();
  };

  useEffect(() => {
    if (review) {
      setFormData(review);
    }
  }, [review]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {review ? "Edit Evaluation" : "New Evaluation"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} pb={4}>
              <FormControl isRequired>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Code Quality (1-5)</FormLabel>
                <NumberInput
                  min={1}
                  max={5}
                  step={0.1}
                  value={formData.codeQuality}
                  onChange={(valueString, valueNumber) =>
                    handleChange("codeQuality", valueNumber)
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Communication (1-5)</FormLabel>
                <NumberInput
                  min={1}
                  max={5}
                  step={0.1}
                  value={formData.communication}
                  onChange={(valueString, valueNumber) =>
                    handleChange("communication", valueNumber)
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Teamwork (1-5)</FormLabel>
                <NumberInput
                  min={1}
                  max={5}
                  step={0.1}
                  value={formData.teamwork}
                  onChange={(valueString, valueNumber) =>
                    handleChange("teamwork", valueNumber)
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Delivery (1-5)</FormLabel>
                <NumberInput
                  min={1}
                  max={5}
                  step={0.1}
                  value={formData.delivery}
                  onChange={(valueString, valueNumber) =>
                    handleChange("delivery", valueNumber)
                  }
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Strengths (comma-separated)</FormLabel>
                <Input
                  value={formData.strengths?.join(", ")}
                  onChange={(e) =>
                    handleChange(
                      "strengths",
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                  placeholder="Communication, Problem Solving, etc."
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Areas for Improvement (comma-separated)</FormLabel>
                <Input
                  value={formData.improvements?.join(", ")}
                  onChange={(e) =>
                    handleChange(
                      "improvements",
                      e.target.value.split(",").map((s) => s.trim())
                    )
                  }
                  placeholder="Testing, Documentation, etc."
                />
              </FormControl>

              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Additional comments..."
                />
              </FormControl>

              <Button type="submit" colorScheme="blue" width="full">
                {review ? "Update Evaluation" : "Add Evaluation"}
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReviewForm;
