import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register a font (optional, using default fonts for now)
Font.register({
    family: 'Helvetica',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
        { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 }
    ]
});

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        backgroundColor: '#ffffff'
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#2563eb',
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 5,
        maxWidth: '70%'
    },
    subtitle: {
        fontSize: 12,
        color: '#64748b'
    },
    brand: {
        fontSize: 16,
        color: '#2563eb',
        fontWeight: 'bold'
    },
    image: {
        width: '100%',
        height: 200,
        objectFit: 'cover',
        borderRadius: 8,
        marginBottom: 20
    },
    metaSection: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#f8fafc',
        padding: 10,
        borderRadius: 4
    },
    metaItem: {
        flex: 1,
    },
    metaLabel: {
        fontSize: 10,
        color: '#64748b',
        textTransform: 'uppercase',
        marginBottom: 2
    },
    metaValue: {
        fontSize: 12,
        color: '#0f172a',
        fontWeight: 'bold'
    },
    content: {
        fontSize: 12,
        lineHeight: 1.6,
        color: '#334155',
        marginBottom: 20
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: 10,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 10
    }
});

const LessonPDF = ({ lesson }) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>{lesson.title}</Text>
                    <Text style={styles.subtitle}>{lesson.category} • By {lesson.author?.name || 'Anonymous'}</Text>
                </View>
                <Text style={styles.brand}>Rewise</Text>
            </View>

            {/* Main Image */}
            {/* React-PDF needs valid image URLs. If using local or protected images, this might fail unless handled. 
          Using safe fallback if provided image might cause issues. 
          Ideally, we filter out invalid URLs or handle CORS. for now using standard rendering.
      */}
            {lesson.image && (
                <Image
                    src={lesson.image}
                    style={styles.image}
                    cache={false} // Sometimes helps with CORS
                />
            )}

            {/* Metadata */}
            <View style={styles.metaSection}>
                <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Published</Text>
                    <Text style={styles.metaValue}>{new Date(lesson.createdAt).toLocaleDateString()}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Emotional Tone</Text>
                    <Text style={styles.metaValue}>{lesson.emotionalTone || 'Neutral'}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Difficulty</Text>
                    <Text style={styles.metaValue}>{lesson.difficulty || 'General'}</Text>
                </View>
            </View>

            {/* Content */}
            <View>
                <Text style={styles.content}>
                    {lesson.description}
                </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text>Downloaded from Rewise Learning Platform</Text>
                <Text>https://rewise.app/lessons/{lesson._id}</Text>
            </View>

        </Page>
    </Document>
);

export default LessonPDF;
