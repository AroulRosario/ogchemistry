import { COLORS, STYLES } from '@/constants/theme';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { ComicButton } from '../ComicButton';

interface QuizData {
    question: string;
    options: string[];
    answer: string;
}

export function QuizView({ data, onComplete }: { data: QuizData, onComplete: () => void }) {
    const [selected, setSelected] = useState<string | null>(null);

    const handleAnswer = (option: string) => {
        setSelected(option);
        if (option === data.answer) {
            Alert.alert("BAM!", "Correct Answer!", [{ text: "Next", onPress: onComplete }]);
        } else {
            Alert.alert("OOF!", "Try Again!");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.question}>{data.question}</Text>
            {data.options.map((option, index) => (
                <ComicButton
                    key={index}
                    title={option}
                    onPress={() => handleAnswer(option)}
                    variant={selected === option ? 'yellow' : 'primary'}
                    style={styles.option}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 24,
        ...STYLES.card,
    },
    question: {
        fontFamily: 'Bangers_400Regular',
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        color: COLORS.black,
    },
    option: {
        marginBottom: 10,
    },
});
