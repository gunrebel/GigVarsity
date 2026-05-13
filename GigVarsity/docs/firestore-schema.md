# Firestore Schema for GigVarsity

## Collection: users
Document ID: Firebase Auth UID

Fields:
- uid: string
- name: string
- email: string
- role: 'student' | 'company' | null
- createdAt: Timestamp
- profileComplete: boolean

If role is student:
- university: string
- course: string
- yearOfStudy: string
- skills: string[]
- bio: string
- availability: string
- portfolioItems: array of { title: string, description: string, fileUrl: string, type: string }
- rating: number
- totalRatings: number
- totalEarned: number
- isVerified: boolean
- profileImageUrl: string

If role is company:
- companyName: string
- industry: string
- description: string
- website: string
- logoUrl: string
- isVerified: boolean

---

## Collection: jobs
Document ID: auto-generated

Fields:
- jobId: string
- title: string
- description: string
- skills: string[]
- budget: number
- deadline: string
- jobType: 'gig' | 'internship'
- workMode: 'remote' | 'onsite' | 'hybrid'
- companyId: string
- companyName: string
- companyLogoUrl: string
- status: 'open' | 'closed' | 'in-progress'
- applicantCount: number
- createdAt: Timestamp
- location: string (optional)

---

## Collection: applications
Document ID: auto-generated

Fields:
- applicationId: string
- jobId: string
- jobTitle: string
- companyId: string
- companyName: string
- studentId: string
- studentName: string
- studentUniversity: string
- studentSkills: string[]
- coverLetter: string
- status: 'applied' | 'reviewing' | 'hired' | 'completed' | 'rejected'
- createdAt: Timestamp
- updatedAt: Timestamp
- milestones: array

---

## Subcollection: applications/{applicationId}/milestones
Document ID: auto-generated

Fields:
- milestoneId: string
- title: string
- description: string
- amount: number
- status: 'pending' | 'in-progress' | 'submitted' | 'approved' | 'paid'
- dueDate: string
- createdAt: Timestamp

---

## Collection: conversations
Document ID: auto-generated

Fields:
- conversationId: string
- participants: string[]
- participantNames: object { [uid]: string }
- participantRoles: object { [uid]: string }
- jobId: string (optional)
- lastMessage: string
- lastMessageTime: Timestamp
- createdAt: Timestamp

### Subcollection: conversations/{conversationId}/messages
Document ID: auto-generated

Fields:
- messageId: string
- senderId: string
- senderName: string
- text: string
- createdAt: Timestamp
- read: boolean

---

## Collection: reviews
Document ID: auto-generated

Fields:
- reviewId: string
- jobId: string
- reviewerId: string
- revieweeId: string
- rating: number
- comment: string
- createdAt: Timestamp

---

## Collection: disputes
Document ID: auto-generated

Fields:
- disputeId: string
- applicationId: string
- raisedBy: string
- raisedByRole: 'student' | 'company'
- reason: string
- description: string
- status: 'open' | 'under-review' | 'resolved'
- createdAt: Timestamp
