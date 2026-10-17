import { Font, StyleSheet } from '@react-pdf/renderer';

Font.register({
  family: 'Times New Roman',
  fonts: [
    {
      src: '/fonts/TimesNewRoman-Regular.ttf',
      fontWeight: 'normal',
    },
    {
      src: '/fonts/TimesNewRoman-Bold.ttf',
      fontWeight: 'bold',
    },
    {
      src: '/fonts/TimesNewRoman-Italic.ttf',
      fontWeight: 'normal',
      fontStyle: 'italic',
    },
  ],
});

export const styles = StyleSheet.create({
  page: {
    paddingTop: 70.6,
    paddingRight: 42.4,
    paddingBottom: 28,
    paddingLeft: 84.96,
    fontFamily: 'Times New Roman',
    fontSize: 11.04,
    lineHeight: 1.15,
    color: '#000000',
  },
  header: {
    marginRight: 0,
    marginBottom: 19,
    marginLeft: -50,
    textAlign: 'center',
  },
  ministry: {
    marginBottom: 6.1,
    fontSize: 11.04,
    fontWeight: 'bold',
  },
  university: {
    fontSize: 11.04,
    fontWeight: 'bold',
    lineHeight: 1.2174,
  },
  recipient: {
    width: 273.72,
    alignSelf: 'flex-end',
    marginBottom: 8,
  },
  recipientHeader: {
    width: 214.52,
    alignSelf: 'flex-end',
  },
  recipientRole: {
    height: 25.44,
    marginBottom: 0,
    fontSize: 11.04,
    textAlign: 'center',
    lineHeight: 1.15,
  },
  recipientValue: {
    minHeight: 11,
    marginBottom: 0,
    paddingBottom: 1,
    borderBottomWidth: 0.7,
    borderBottomColor: '#000000',
    textAlign: 'right',
  },
  compactRecipientLine: {
    height: 10.8,
    minHeight: 0,
    fontSize: 1,
    lineHeight: 1,
  },
  recipientHint: {
    width: 185.8,
    alignSelf: 'flex-end',
    marginBottom: 0,
    fontSize: 7.92,
    lineHeight: 1,
    textAlign: 'center',
  },
  applicantHint: {
    width: 189,
    alignSelf: 'flex-end',
    marginTop: -4.5,
    marginBottom: 1.5,
    fontSize: 7.92,
    lineHeight: 1,
    textAlign: 'center',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  signRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: 6.8,
  },
  paragraphRow: {
    marginLeft: 36.5,
  },
  flexLine: {
    flexGrow: 1,
    minHeight: 13,
    paddingRight: 2,
    paddingBottom: 1,
    paddingLeft: 2,
    borderBottomWidth: 0.7,
    borderBottomColor: '#000000',
    textAlign: 'center',
  },
  courseLine: {
    width: 65,
    minHeight: 13,
    paddingBottom: 1,
    borderBottomWidth: 0.7,
    borderBottomColor: '#000000',
    textAlign: 'center',
  },
  groupLine: {
    width: 55,
    minHeight: 13,
    paddingBottom: 1,
    borderBottomWidth: 0.7,
    borderBottomColor: '#000000',
    textAlign: 'center',
  },
  addressLabel: {
    marginTop: -4.7,
    textAlign: 'right',
  },
  courseRow: {
    marginLeft: 16,
  },
  addressBlock: {
    width: 236.52,
    alignSelf: 'flex-end',
  },
  telephoneRow: {
    width: 180.4,
    alignSelf: 'flex-end',
  },
  addressLine: {
    minHeight: 12.6,
    marginBottom: 0,
    paddingBottom: 1,
    borderBottomWidth: 0.7,
    borderBottomColor: '#000000',
    textAlign: 'center',
  },
  compactAddressLine: {
    height: 9.1,
    minHeight: 0,
    fontSize: 1,
    lineHeight: 1,
  },
  telephoneLine: {
    flexGrow: 1,
    minHeight: 13,
    paddingBottom: 1,
    borderBottomWidth: 0.7,
    borderBottomColor: '#000000',
    textAlign: 'center',
  },
  title: {
    marginTop: 2,
    marginBottom: 11,
    fontSize: 11.04,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  request: {
    marginBottom: 10.5,
  },
  dateLine: {
    width: 74,
    minHeight: 13,
    paddingBottom: 1,
    borderBottomWidth: 0.7,
    borderBottomColor: '#000000',
    textAlign: 'center',
  },
  consentText: {
    marginBottom: -1.7,
    textAlign: 'left',
    textIndent: 22,
  },
  roommateBlock: {
    marginBottom: 4.1,
  },
  thirdRoommate: {
    marginTop: 5.5,
  },
  roommateRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    fontSize: 12,
  },
  roommateNameLine: {
    flexGrow: 1,
    minHeight: 13,
    paddingBottom: 1,
    borderBottomWidth: 0.7,
    borderBottomColor: '#000000',
  },
  slash: {
    width: 14,
    textAlign: 'center',
  },
  roommateSignatureLine: {
    width: 126.2,
    minHeight: 13,
    borderBottomWidth: 0.7,
    borderBottomColor: '#000000',
  },
  roommateHints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 1,
    marginLeft: 13,
  },
  nameHint: {
    width: 217,
    fontSize: 7.92,
    textAlign: 'center',
  },
  signatureHint: {
    width: 148,
    fontSize: 7.92,
    textAlign: 'center',
  },
  rules: {
    marginTop: 6.3,
    marginBottom: 12.1,
    textAlign: 'left',
  },
  rulesFirstLine: {
    marginLeft: 24.7,
  },
  blankLine: {
    flexGrow: 1,
    minHeight: 13,
    borderBottomWidth: 0.7,
    borderBottomColor: '#000000',
  },
  shortBlankLine: {
    width: 122.5,
    minHeight: 13,
    borderBottomWidth: 0.7,
    borderBottomColor: '#000000',
  },
  received: {
    marginTop: 5,
    fontStyle: 'italic',
  },
  tinyBlankLine: {
    width: 24,
    minHeight: 13,
    borderBottomWidth: 0.7,
    borderBottomColor: '#000000',
  },
  incomingBlankLine: {
    width: 44,
    minHeight: 13,
    borderBottomWidth: 0.7,
    borderBottomColor: '#000000',
  },
  hint: {
    marginTop: -3,
    marginBottom: 5,
    fontSize: 7.92,
    textAlign: 'center',
  },
  visasTitle: {
    marginTop: 5,
    marginBottom: 10.4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  visaBlock: {
    marginBottom: 9.2,
  },
  visaPosition: {
    marginBottom: 0.5,
    fontSize: 12,
    textIndent: 18,
    letterSpacing: 0.05,
  },
  visaChoice: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  visaText: {
    fontSize: 12,
  },
  visaInstruction: {
    marginLeft: 4.7,
  },
  requestContinuation: {
    height: 9.4,
    minHeight: 0,
    fontSize: 1,
    lineHeight: 1,
    borderBottomWidth: 0.7,
    borderBottomColor: '#000000',
  },
  guestHint: {
    marginBottom: 0,
    fontSize: 7.92,
    lineHeight: 1,
    textAlign: 'center',
  },
  secondVisaRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: 18,
    fontSize: 12,
  },
  secondVisaContinuation: {
    width: 231,
    minHeight: 13,
    borderBottomWidth: 0.7,
    borderBottomColor: '#000000',
  },
  receivedFirstRow: {
    marginBottom: -0.7,
  },
  receivedHint: {
    marginTop: -4.1,
    marginBottom: 0.5,
  },
  firstVisaHint: {
    width: 209,
    alignSelf: 'flex-end',
  },
  secondVisaHint: {
    width: 264,
    alignSelf: 'flex-start',
  },
});
