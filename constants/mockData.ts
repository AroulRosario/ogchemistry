export const MOCK_LESSONS = [
    {
        id: 'mock-1',
        title: 'Atomic Structure',
        description: 'Explore the building blocks of matter — protons, neutrons, and electrons.',
        order: 1,
    },
    {
        id: 'mock-2',
        title: 'Chemical Bonding',
        description: 'Understand ionic, covalent, and metallic bonds that hold molecules together.',
        order: 2,
    },
    {
        id: 'mock-3',
        title: 'The Periodic Table',
        description: 'Navigate groups, periods, and trends across the elements.',
        order: 3,
    },
];

export const MOCK_CHAPTERS = [
    {
        id: 'mock-ch-1',
        lesson_id: 'mock-1',
        title: 'Chapter 1: The Atom',
        order: 1,
    },
    {
        id: 'mock-ch-2',
        lesson_id: 'mock-1',
        title: 'Chapter 2: Electron Configuration',
        order: 2,
    },
];

export const MOCK_CONTENT = [
    {
        id: 'mock-ci-1',
        chapter_id: 'mock-ch-1',
        type: 'video',
        data: { title: 'Introduction to Atoms', url: 'https://example.com/atoms-intro', description: 'A visual walkthrough of atomic structure.' },
        order: 1,
    },
    {
        id: 'mock-ci-2',
        chapter_id: 'mock-ch-1',
        type: 'quiz',
        data: {
            title: 'Atom Basics Quiz',
            question: 'What particle has a positive charge?',
            options: ['Electron', 'Proton', 'Neutron'],
            answer: 'Proton',
        },
        order: 2,
    },
];

// Legacy alias
export const MOCK_CONTENT_ITEMS = MOCK_CONTENT;
