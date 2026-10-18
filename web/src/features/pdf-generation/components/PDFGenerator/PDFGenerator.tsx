import { Document, Page, Text, View } from '@react-pdf/renderer';
import type { ApplicationFormData } from '@/features/application-form/types/ApplicationFormData.ts';
import { facultyDirectory } from '@/features/application-form/constants/facultyDirectory.constants.ts';
import { dormitoryAddress } from '@/features/application-form/constants/dormitoryAddress.constants.ts';
import { formatName } from '@/features/pdf-generation/lib/formatName.ts';
import { styles } from './PDFGenerator.styles.ts';

type PDFGeneratorProps = {
  data: ApplicationFormData[];
};

type ApplicationProps = {
  data: ApplicationFormData;
};

function formatDate(value: string) {
  const [year, month, day] = value.split('-');

  return year && month && day ? `${day}.${month}.${year}` : value;
}

export function PDFGenerator({ data }: PDFGeneratorProps) {
  return (
    <Document>
      {data.map((doc, index) => (
        <ApplicationPage key={`${doc.name}-${doc.start}-${doc.end}-${index}`} data={doc} />
      ))}
    </Document>
  );
}

function ApplicationPage({ data }: ApplicationProps) {
  const recipient = facultyDirectory[data.faculty];
  const dormitory = dormitoryAddress[data.dormitory];
  const roommates = [...data.roommates, '', '', ''].slice(0, 3);
  const applicantName = formatName(data.name);
  const guest = data.relationship
    ? `${formatName(data.guest)} (${data.relationship})`
    : formatName(data.guest);
  const address = dormitory
    ? `${dormitory.address}${data.room ? `, комната ${data.room}` : ''}`
    : '';

  if (!recipient) {
    throw new Error(`Не найден руководитель для факультета: ${data.faculty}`);
  }

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.ministry}>МИНОБРНАУКИ РОССИИ</Text>
        <Text style={styles.university}>
          Федеральное государственное автономное образовательное учреждение высшего образования
          {'\n'}
          «Новосибирский национальный исследовательский государственный университет»
          {'\n'}
          (Новосибирский государственный университет, НГУ)
        </Text>
      </View>

      <View style={styles.recipient}>
        <View style={styles.recipientHeader}>
          <Text style={styles.recipientRole}>{recipient.addressTo}</Text>
          <Text style={styles.recipientValue}>{recipient.headName}</Text>
          <Text style={[styles.recipientValue, styles.compactRecipientLine]}> </Text>
          <Text style={styles.recipientHint}>(указать название и ФИО руководителя)</Text>
        </View>

        <View style={styles.fieldRow}>
          <Text>Обучающегося </Text>
          <Text style={styles.flexLine}>{applicantName}</Text>
        </View>
        <Text style={styles.applicantHint}>(указать ФИО)</Text>

        <View style={[styles.fieldRow, styles.courseRow]}>
          <Text style={styles.courseLine}>{data.course}</Text>
          <Text> курса/года обучения, группа № </Text>
          <Text style={styles.groupLine}>{data.group}</Text>
        </View>

        <View style={styles.addressBlock}>
          <Text style={styles.addressLabel}>проживающего по адресу:</Text>
          <Text style={styles.addressLine}>{address}</Text>
          <Text style={[styles.addressLine, styles.compactAddressLine]}> </Text>
        </View>

        <View style={[styles.fieldRow, styles.telephoneRow]}>
          <Text>тел. </Text>
          <Text style={styles.telephoneLine}>{data.tel}</Text>
        </View>
      </View>

      <Text style={styles.title}>Заявление.</Text>

      <View style={styles.request}>
        <View style={[styles.fieldRow, styles.paragraphRow]}>
          <Text>Прошу разрешить посещение </Text>
          <Text style={styles.flexLine}>{guest}</Text>
        </View>
        <Text style={styles.requestContinuation}> </Text>
        <Text style={styles.guestHint}>(указать ФИО гостя и кем приходится обучающемуся)</Text>
        <View style={styles.fieldRow}>
          <Text>на период: с </Text>
          <Text style={styles.dateLine}>{formatDate(data.start)}</Text>
          <Text> по </Text>
          <Text style={styles.dateLine}>{formatDate(data.end)}</Text>
          <Text>.</Text>
        </View>
      </View>

      <Text style={styles.consentText}>
        Соседи, проживающие со мной в комнате, выразили согласие на допуск моего гостя, что
        подтверждается их подписями:
      </Text>

      {roommates.map((roommate, index) => (
        <View
          key={index}
          style={index === 2 ? [styles.roommateBlock, styles.thirdRoommate] : styles.roommateBlock}
        >
          <View style={styles.roommateRow}>
            <Text>{index + 1}. </Text>
            <Text style={styles.roommateNameLine}>{roommate}</Text>
            <Text style={styles.slash}>/</Text>
            <Text style={styles.roommateSignatureLine}> </Text>
          </View>
          <View style={styles.roommateHints}>
            <Text style={styles.nameHint}>(ФИО)</Text>
            <Text style={styles.signatureHint}>(подпись)</Text>
          </View>
        </View>
      ))}

      <View style={styles.rules}>
        <Text style={styles.rulesFirstLine}>
          Правила внутреннего распорядка в студенческих общежитиях, введенных в действие
        </Text>
        <Text>приказом ректора от 24.06.2026 г. №1708-3, обязуюсь добросовестно соблюдать.</Text>
      </View>

      <View style={styles.signRow}>
        <Text>Дата: </Text>
        <Text style={styles.shortBlankLine}> </Text>
        <Text> Подпись: </Text>
        <Text style={styles.shortBlankLine}> </Text>
      </View>

      <View style={styles.received}>
        <View style={[styles.fieldRow, styles.receivedFirstRow]}>
          <Text>Поступило в УМО «</Text>
          <Text style={styles.tinyBlankLine}> </Text>
          <Text>» </Text>
          <Text style={styles.tinyBlankLine}> </Text>
          <Text> 202_ г., вх. № </Text>
          <Text style={styles.incomingBlankLine}> </Text>
        </View>
        <View style={styles.fieldRow}>
          <Text>/</Text>
          <Text style={styles.blankLine}> </Text>
        </View>
        <Text style={[styles.hint, styles.receivedHint]}>(должность, ФИО, подпись)</Text>
      </View>

      <Text style={styles.visasTitle}>ВИЗЫ:</Text>

      <View style={styles.visaBlock}>
        <Text style={styles.visaPosition}>
          1. Декан факультета/директор института/ руководитель структурного подразделения:
        </Text>
        <View style={[styles.fieldRow, styles.visaText]}>
          <Text style={styles.visaChoice}>согласовано/не согласовано</Text>
          <Text style={styles.visaInstruction}>(подчеркнуть нужное) </Text>
          <Text style={styles.blankLine}> </Text>
        </View>
        <Text style={[styles.hint, styles.firstVisaHint]}>(дата, подпись)</Text>
      </View>

      <View style={styles.visaBlock}>
        <View style={styles.secondVisaRow}>
          <Text>2. Начальник УКБ: </Text>
          <Text style={styles.visaChoice}>согласовано/не согласовано</Text>
          <Text style={styles.visaInstruction}>(подчеркнуть нужное) </Text>
          <Text style={styles.blankLine}> </Text>
        </View>
        <View style={styles.fieldRow}>
          <Text style={styles.secondVisaContinuation}> </Text>
          <Text>.</Text>
        </View>
        <Text style={[styles.hint, styles.secondVisaHint]}>(дата, подпись)</Text>
      </View>
    </Page>
  );
}
