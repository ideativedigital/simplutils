import { z, ZodType } from 'zod'

export const Countries = [
  {
    name: 'Afghanistan',
    flag: '🇦🇫',
    code: 'AF',
    dial_code: '+93',
    fr_name: 'Afghanistan',
    de_name: 'Afghanistan'
  },
  {
    name: 'Åland Islands',
    flag: '🇦🇽',
    code: 'AX',
    dial_code: '+358',
    fr_name: 'Îles Åland',
    de_name: 'Ålandinseln'
  },
  {
    name: 'Albania',
    flag: '🇦🇱',
    code: 'AL',
    dial_code: '+355',
    fr_name: 'Albanie',
    de_name: 'Albanien'
  },
  {
    name: 'Algeria',
    flag: '🇩🇿',
    code: 'DZ',
    dial_code: '+213',
    fr_name: 'Algérie',
    de_name: 'Algerien'
  },
  {
    name: 'American Samoa',
    flag: '🇦🇸',
    code: 'AS',
    dial_code: '+1684',
    fr_name: 'Samoa américaines',
    de_name: 'Amerikanisch-Samoa'
  },
  {
    name: 'Andorra',
    flag: '🇦🇩',
    code: 'AD',
    dial_code: '+376',
    fr_name: 'Andorre',
    de_name: 'Andorra'
  },
  {
    name: 'Angola',
    flag: '🇦🇴',
    code: 'AO',
    dial_code: '+244',
    fr_name: 'Angola',
    de_name: 'Angola'
  },
  {
    name: 'Anguilla',
    flag: '🇦🇮',
    code: 'AI',
    dial_code: '+1264',
    fr_name: 'Anguilla',
    de_name: 'Anguilla'
  },
  {
    name: 'Antarctica',
    flag: '🇦🇶',
    code: 'AQ',
    dial_code: '+672',
    fr_name: 'Antarctique',
    de_name: 'Antarktis'
  },
  {
    name: 'Antigua and Barbuda',
    flag: '🇦🇬',
    code: 'AG',
    dial_code: '+1268',
    fr_name: 'Antigua-et-Barbuda',
    de_name: 'Antigua und Barbuda'
  },
  {
    name: 'Argentina',
    flag: '🇦🇷',
    code: 'AR',
    dial_code: '+54',
    fr_name: 'Argentine',
    de_name: 'Argentinien'
  },
  {
    name: 'Armenia',
    flag: '🇦🇲',
    code: 'AM',
    dial_code: '+374',
    fr_name: 'Arménie',
    de_name: 'Armenien'
  },
  {
    name: 'Aruba',
    flag: '🇦🇼',
    code: 'AW',
    dial_code: '+297',
    fr_name: 'Aruba',
    de_name: 'Aruba'
  },
  {
    name: 'Australia',
    flag: '🇦🇺',
    code: 'AU',
    dial_code: '+61',
    fr_name: 'Australie',
    de_name: 'Australien'
  },
  {
    name: 'Austria',
    flag: '🇦🇹',
    code: 'AT',
    dial_code: '+43',
    fr_name: 'Autriche',
    de_name: 'Österreich'
  },
  {
    name: 'Azerbaijan',
    flag: '🇦🇿',
    code: 'AZ',
    dial_code: '+994',
    fr_name: 'Azerbaïdjan',
    de_name: 'Aserbaidschan'
  },
  {
    name: 'Bahamas',
    flag: '🇧🇸',
    code: 'BS',
    dial_code: '+1242',
    fr_name: 'Bahamas',
    de_name: 'Bahamas'
  },
  {
    name: 'Bahrain',
    flag: '🇧🇭',
    code: 'BH',
    dial_code: '+973',
    fr_name: 'Bahreïn',
    de_name: 'Bahrain'
  },
  {
    name: 'Bangladesh',
    flag: '🇧🇩',
    code: 'BD',
    dial_code: '+880',
    fr_name: 'Bangladesh',
    de_name: 'Bangladesch'
  },
  {
    name: 'Barbados',
    flag: '🇧🇧',
    code: 'BB',
    dial_code: '+1246',
    fr_name: 'Barbade',
    de_name: 'Barbados'
  },
  {
    name: 'Belarus',
    flag: '🇧🇾',
    code: 'BY',
    dial_code: '+375',
    fr_name: 'Biélorussie',
    de_name: 'Weißrussland'
  },
  {
    name: 'Belgium',
    flag: '🇧🇪',
    code: 'BE',
    dial_code: '+32',
    fr_name: 'Belgique',
    de_name: 'Belgien'
  },
  {
    name: 'Belize',
    flag: '🇧🇿',
    code: 'BZ',
    dial_code: '+501',
    fr_name: 'Belize',
    de_name: 'Belize'
  },
  {
    name: 'Benin',
    flag: '🇧🇯',
    code: 'BJ',
    dial_code: '+229',
    fr_name: 'Bénin',
    de_name: 'Benin'
  },
  {
    name: 'Bermuda',
    flag: '🇧🇲',
    code: 'BM',
    dial_code: '+1441',
    fr_name: 'Bermudes',
    de_name: 'Bermuda'
  },
  {
    name: 'Bhutan',
    flag: '🇧🇹',
    code: 'BT',
    dial_code: '+975',
    fr_name: 'Bhoutan',
    de_name: 'Bhutan'
  },
  {
    name: 'Bolivia',
    flag: '🇧🇴',
    code: 'BO',
    dial_code: '+591',
    fr_name: 'Bolivie',
    de_name: 'Bolivien'
  },
  {
    name: 'Bosnia and Herzegovina',
    flag: '🇧🇦',
    code: 'BA',
    dial_code: '+387',
    fr_name: 'Bosnie-Herzégovine',
    de_name: 'Bosnien und Herzegowina'
  },
  {
    name: 'Botswana',
    flag: '🇧🇼',
    code: 'BW',
    dial_code: '+267',
    fr_name: 'Botswana',
    de_name: 'Botswana'
  },
  {
    name: 'Bouvet Island',
    flag: '🇧🇻',
    code: 'BV',
    dial_code: '+47',
    fr_name: 'Île Bouvet',
    de_name: 'Bouvetinsel'
  },
  {
    name: 'Brazil',
    flag: '🇧🇷',
    code: 'BR',
    dial_code: '+55',
    fr_name: 'Brésil',
    de_name: 'Brasilien'
  },
  {
    name: 'British Indian Ocean Territory',
    flag: '🇮🇴',
    code: 'IO',
    dial_code: '+246',
    fr_name: "Territoire britannique de l'océan Indien",
    de_name: 'Britisches Territorium im Indischen Ozean'
  },
  {
    name: 'Brunei Darussalam',
    flag: '🇧🇳',
    code: 'BN',
    dial_code: '+673',
    fr_name: 'Brunei',
    de_name: 'Brunei Darussalam'
  },
  {
    name: 'Bulgaria',
    flag: '🇧🇬',
    code: 'BG',
    dial_code: '+359',
    fr_name: 'Bulgarie',
    de_name: 'Bulgarien'
  },
  {
    name: 'Burkina Faso',
    flag: '🇧🇫',
    code: 'BF',
    dial_code: '+226',
    fr_name: 'Burkina Faso',
    de_name: 'Burkina Faso'
  },
  {
    name: 'Burundi',
    flag: '🇧🇮',
    code: 'BI',
    dial_code: '+257',
    fr_name: 'Burundi',
    de_name: 'Burundi'
  },
  {
    name: 'Cambodia',
    flag: '🇰🇭',
    code: 'KH',
    dial_code: '+855',
    fr_name: 'Cambodge',
    de_name: 'Kambodscha'
  },
  {
    name: 'Cameroon',
    flag: '🇨🇲',
    code: 'CM',
    dial_code: '+237',
    fr_name: 'Cameroun',
    de_name: 'Kamerun'
  },
  {
    name: 'Canada',
    flag: '🇨🇦',
    code: 'CA',
    dial_code: '+1',
    fr_name: 'Canada',
    de_name: 'Kanada'
  },
  {
    name: 'Cape Verde',
    flag: '🇨🇻',
    code: 'CV',
    dial_code: '+238',
    fr_name: 'Cap-Vert',
    de_name: 'Kap Verde'
  },
  {
    name: 'Cayman Islands',
    flag: '🇰🇾',
    code: 'KY',
    dial_code: '+345',
    fr_name: 'Îles Caïmans',
    de_name: 'Kaimaninseln'
  },
  {
    name: 'Central African Republic',
    flag: '🇨🇫',
    code: 'CF',
    dial_code: '+236',
    fr_name: 'République centrafricaine',
    de_name: 'Zentralafrikanische Republik'
  },
  {
    name: 'Chad',
    flag: '🇹🇩',
    code: 'TD',
    dial_code: '+235',
    fr_name: 'Tchad',
    de_name: 'Tschad'
  },
  {
    name: 'Chile',
    flag: '🇨🇱',
    code: 'CL',
    dial_code: '+56',
    fr_name: 'Chili',
    de_name: 'Chile'
  },
  {
    name: 'China',
    flag: '🇨🇳',
    code: 'CN',
    dial_code: '+86',
    fr_name: 'Chine',
    de_name: 'China'
  },
  {
    name: 'Christmas Island',
    flag: '🇨🇽',
    code: 'CX',
    dial_code: '+61',
    fr_name: 'Île Christmas',
    de_name: 'Weihnachtsinsel'
  },
  {
    name: 'Cocos (Keeling) Islands',
    flag: '🇨🇨',
    code: 'CC',
    dial_code: '+61',
    fr_name: 'Îles Cocos',
    de_name: 'Kokosinseln'
  },
  {
    name: 'Colombia',
    flag: '🇨🇴',
    code: 'CO',
    dial_code: '+57',
    fr_name: 'Colombie',
    de_name: 'Kolumbien'
  },
  {
    name: 'Comoros',
    flag: '🇰🇲',
    code: 'KM',
    dial_code: '+269',
    fr_name: 'Comores',
    de_name: 'Komoren'
  },
  {
    name: 'Congo',
    flag: '🇨🇬',
    code: 'CG',
    dial_code: '+242',
    fr_name: 'Congo',
    de_name: 'Kongo'
  },
  {
    name: 'Congo, The Democratic Republic of the Congo',
    flag: '🇨🇩',
    code: 'CD',
    dial_code: '+243',
    fr_name: 'République démocratique du Congo',
    de_name: 'Demokratische Republik Kongo'
  },
  {
    name: 'Cook Islands',
    flag: '🇨🇰',
    code: 'CK',
    dial_code: '+682',
    fr_name: 'Îles Cook',
    de_name: 'Cookinseln'
  },
  {
    name: 'Costa Rica',
    flag: '🇨🇷',
    code: 'CR',
    dial_code: '+506',
    fr_name: 'Costa Rica',
    de_name: 'Costa Rica'
  },
  {
    name: "Côte d'Ivoire",
    flag: '🇨🇮',
    code: 'CI',
    dial_code: '+225',
    fr_name: "Côte d'Ivoire",
    de_name: 'Elfenbeinküste'
  },
  {
    name: 'Croatia',
    flag: '🇭🇷',
    code: 'HR',
    dial_code: '+385',
    fr_name: 'Croatie',
    de_name: 'Kroatien'
  },
  {
    name: 'Cuba',
    flag: '🇨🇺',
    code: 'CU',
    dial_code: '+53',
    fr_name: 'Cuba',
    de_name: 'Kuba'
  },
  {
    name: 'Cyprus',
    flag: '🇨🇾',
    code: 'CY',
    dial_code: '+357',
    fr_name: 'Chypre',
    de_name: 'Zypern'
  },
  {
    name: 'Czech Republic',
    flag: '🇨🇿',
    code: 'CZ',
    dial_code: '+420',
    fr_name: 'République tchèque',
    de_name: 'Tschechien'
  },
  {
    name: 'Denmark',
    flag: '🇩🇰',
    code: 'DK',
    dial_code: '+45',
    fr_name: 'Danemark',
    de_name: 'Dänemark'
  },
  {
    name: 'Djibouti',
    flag: '🇩🇯',
    code: 'DJ',
    dial_code: '+253',
    fr_name: 'Djibouti',
    de_name: 'Dschibuti'
  },
  {
    name: 'Dominica',
    flag: '🇩🇲',
    code: 'DM',
    dial_code: '+1767',
    fr_name: 'Dominique',
    de_name: 'Dominica'
  },
  {
    name: 'Dominican Republic',
    flag: '🇩🇴',
    code: 'DO',
    dial_code: '+1849',
    fr_name: 'République dominicaine',
    de_name: 'Dominikanische Republik'
  },
  {
    name: 'Ecuador',
    flag: '🇪🇨',
    code: 'EC',
    dial_code: '+593',
    fr_name: 'Équateur',
    de_name: 'Ecuador'
  },
  {
    name: 'Egypt',
    flag: '🇪🇬',
    code: 'EG',
    dial_code: '+20',
    fr_name: 'Égypte',
    de_name: 'Ägypten'
  },
  {
    name: 'El Salvador',
    flag: '🇸🇻',
    code: 'SV',
    dial_code: '+503',
    fr_name: 'Salvador',
    de_name: 'El Salvador'
  },
  {
    name: 'Equatorial Guinea',
    flag: '🇬🇶',
    code: 'GQ',
    dial_code: '+240',
    fr_name: 'Guinée équatoriale',
    de_name: 'Äquatorialguinea'
  },
  {
    name: 'Eritrea',
    flag: '🇪🇷',
    code: 'ER',
    dial_code: '+291',
    fr_name: 'Érythrée',
    de_name: 'Eritrea'
  },
  {
    name: 'Estonia',
    flag: '🇪🇪',
    code: 'EE',
    dial_code: '+372',
    fr_name: 'Estonie',
    de_name: 'Estland'
  },
  {
    name: 'Ethiopia',
    flag: '🇪🇹',
    code: 'ET',
    dial_code: '+251',
    fr_name: 'Éthiopie',
    de_name: 'Äthiopien'
  },
  {
    name: 'Falkland Islands (Malvinas)',
    flag: '🇫🇰',
    code: 'FK',
    dial_code: '+500',
    fr_name: 'Îles Malouines',
    de_name: 'Falklandinseln'
  },
  {
    name: 'Faroe Islands',
    flag: '🇫🇴',
    code: 'FO',
    dial_code: '+298',
    fr_name: 'Îles Féroé',
    de_name: 'Färöer'
  },
  {
    name: 'Fiji',
    flag: '🇫🇯',
    code: 'FJ',
    dial_code: '+679',
    fr_name: 'Fidji',
    de_name: 'Fidschi'
  },
  {
    name: 'Finland',
    flag: '🇫🇮',
    code: 'FI',
    dial_code: '+358',
    fr_name: 'Finlande',
    de_name: 'Finnland'
  },
  {
    name: 'France',
    flag: '🇫🇷',
    code: 'FR',
    dial_code: '+33',
    fr_name: 'France',
    de_name: 'Frankreich'
  },
  {
    name: 'French Guiana',
    flag: '🇬🇫',
    code: 'GF',
    dial_code: '+594',
    fr_name: 'Guyane française',
    de_name: 'Französisch-Guayana'
  },
  {
    name: 'French Polynesia',
    flag: '🇵🇫',
    code: 'PF',
    dial_code: '+689',
    fr_name: 'Polynésie française',
    de_name: 'Französisch-Polynesien'
  },
  {
    name: 'French Southern Territories',
    flag: '🇹🇫',
    code: 'TF',
    dial_code: '+262',
    fr_name: 'Terres australes françaises',
    de_name: 'Französische Süd- und Antarktisgebiete'
  },
  {
    name: 'Gabon',
    flag: '🇬🇦',
    code: 'GA',
    dial_code: '+241',
    fr_name: 'Gabon',
    de_name: 'Gabun'
  },
  {
    name: 'Gambia',
    flag: '🇬🇲',
    code: 'GM',
    dial_code: '+220',
    fr_name: 'Gambie',
    de_name: 'Gambia'
  },
  {
    name: 'Georgia',
    flag: '🇬🇪',
    code: 'GE',
    dial_code: '+995',
    fr_name: 'Géorgie',
    de_name: 'Georgien'
  },
  {
    name: 'Germany',
    flag: '🇩🇪',
    code: 'DE',
    dial_code: '+49',
    fr_name: 'Allemagne',
    de_name: 'Deutschland'
  },
  {
    name: 'Ghana',
    flag: '🇬🇭',
    code: 'GH',
    dial_code: '+233',
    fr_name: 'Ghana',
    de_name: 'Ghana'
  },
  {
    name: 'Gibraltar',
    flag: '🇬🇮',
    code: 'GI',
    dial_code: '+350',
    fr_name: 'Gibraltar',
    de_name: 'Gibraltar'
  },
  {
    name: 'Greece',
    flag: '🇬🇷',
    code: 'GR',
    dial_code: '+30',
    fr_name: 'Grèce',
    de_name: 'Griechenland'
  },
  {
    name: 'Greenland',
    flag: '🇬🇱',
    code: 'GL',
    dial_code: '+299',
    fr_name: 'Groenland',
    de_name: 'Grönland'
  },
  {
    name: 'Grenada',
    flag: '🇬🇩',
    code: 'GD',
    dial_code: '+1473',
    fr_name: 'Grenade',
    de_name: 'Grenada'
  },
  {
    name: 'Guadeloupe',
    flag: '🇬🇵',
    code: 'GP',
    dial_code: '+590',
    fr_name: 'Guadeloupe',
    de_name: 'Guadeloupe'
  },
  {
    name: 'Guam',
    flag: '🇬🇺',
    code: 'GU',
    dial_code: '+1671',
    fr_name: 'Guam',
    de_name: 'Guam'
  },
  {
    name: 'Guatemala',
    flag: '🇬🇹',
    code: 'GT',
    dial_code: '+502',
    fr_name: 'Guatemala',
    de_name: 'Guatemala'
  },
  {
    name: 'Guernsey',
    flag: '🇬🇬',
    code: 'GG',
    dial_code: '+44',
    fr_name: 'Guernesey',
    de_name: 'Guernsey'
  },
  {
    name: 'Guinea',
    flag: '🇬🇳',
    code: 'GN',
    dial_code: '+224',
    fr_name: 'Guinée',
    de_name: 'Guinea'
  },
  {
    name: 'Guinea-Bissau',
    flag: '🇬🇼',
    code: 'GW',
    dial_code: '+245',
    fr_name: 'Guinée-Bissau',
    de_name: 'Guinea-Bissau'
  },
  {
    name: 'Guyana',
    flag: '🇬🇾',
    code: 'GY',
    dial_code: '+592',
    fr_name: 'Guyana',
    de_name: 'Guyana'
  },
  {
    name: 'Haiti',
    flag: '🇭🇹',
    code: 'HT',
    dial_code: '+509',
    fr_name: 'Haïti',
    de_name: 'Haiti'
  },
  {
    name: 'Heard Island and Mcdonald Islands',
    flag: '🇭🇲',
    code: 'HM',
    dial_code: '+672',
    fr_name: 'Îles Heard-et-MacDonald',
    de_name: 'Heard und McDonaldinseln'
  },
  {
    name: 'Holy See (Vatican City State)',
    flag: '🇻🇦',
    code: 'VA',
    dial_code: '+379',
    fr_name: 'Saint-Siège (État de la Cité du Vatican)',
    de_name: 'Heiliger Stuhl (Staat der Vatikanstadt)'
  },
  {
    name: 'Honduras',
    flag: '🇭🇳',
    code: 'HN',
    dial_code: '+504',
    fr_name: 'Honduras',
    de_name: 'Honduras'
  },
  {
    name: 'Hong Kong',
    flag: '🇭🇰',
    code: 'HK',
    dial_code: '+852',
    fr_name: 'Hong Kong',
    de_name: 'Hongkong'
  },
  {
    name: 'Hungary',
    flag: '🇭🇺',
    code: 'HU',
    dial_code: '+36',
    fr_name: 'Hongrie',
    de_name: 'Ungarn'
  },
  {
    name: 'Iceland',
    flag: '🇮🇸',
    code: 'IS',
    dial_code: '+354',
    fr_name: 'Islande',
    de_name: 'Island'
  },
  {
    name: 'India',
    flag: '🇮🇳',
    code: 'IN',
    dial_code: '+91',
    fr_name: 'Inde',
    de_name: 'Indien'
  },
  {
    name: 'Indonesia',
    flag: '🇮🇩',
    code: 'ID',
    dial_code: '+62',
    fr_name: 'Indonésie',
    de_name: 'Indonesien'
  },
  {
    name: 'Iran',
    flag: '🇮🇷',
    code: 'IR',
    dial_code: '+98',
    fr_name: 'Iran',
    de_name: 'Iran'
  },
  {
    name: 'Iraq',
    flag: '🇮🇶',
    code: 'IQ',
    dial_code: '+964',
    fr_name: 'Irak',
    de_name: 'Irak'
  },
  {
    name: 'Ireland',
    flag: '🇮🇪',
    code: 'IE',
    dial_code: '+353',
    fr_name: 'Irlande',
    de_name: 'Irland'
  },
  {
    name: 'Isle of Man',
    flag: '🇮🇲',
    code: 'IM',
    dial_code: '+44',
    fr_name: 'Île de Man',
    de_name: 'Isle of Man'
  },
  {
    name: 'Israel',
    flag: '🇮🇱',
    code: 'IL',
    dial_code: '+972',
    fr_name: 'Israël',
    de_name: 'Israel'
  },
  {
    name: 'Italy',
    flag: '🇮🇹',
    code: 'IT',
    dial_code: '+39',
    fr_name: 'Italie',
    de_name: 'Italien'
  },
  {
    name: 'Jamaica',
    flag: '🇯🇲',
    code: 'JM',
    dial_code: '+1876',
    fr_name: 'Jamaïque',
    de_name: 'Jamaika'
  },
  {
    name: 'Japan',
    flag: '🇯🇵',
    code: 'JP',
    dial_code: '+81',
    fr_name: 'Japon',
    de_name: 'Japan'
  },
  {
    name: 'Jersey',
    flag: '🇯🇪',
    code: 'JE',
    dial_code: '+44',
    fr_name: 'Jersey',
    de_name: 'Jersey'
  },
  {
    name: 'Jordan',
    flag: '🇯🇴',
    code: 'JO',
    dial_code: '+962',
    fr_name: 'Jordanie',
    de_name: 'Jordanien'
  },
  {
    name: 'Kazakhstan',
    flag: '🇰🇿',
    code: 'KZ',
    dial_code: '+7',
    fr_name: 'Kazakhstan',
    de_name: 'Kasachstan'
  },
  {
    name: 'Kenya',
    flag: '🇰🇪',
    code: 'KE',
    dial_code: '+254',
    fr_name: 'Kenya',
    de_name: 'Kenia'
  },
  {
    name: 'Kiribati',
    flag: '🇰🇮',
    code: 'KI',
    dial_code: '+686',
    fr_name: 'Kiribati',
    de_name: 'Kiribati'
  },
  {
    name: "Korea, Democratic People's Republic of Korea",
    flag: '🇰🇵',
    code: 'KP',
    dial_code: '+850',
    fr_name: 'Corée du Nord',
    de_name: 'Nordkorea'
  },
  {
    name: 'Korea, Republic of South Korea',
    flag: '🇰🇷',
    code: 'KR',
    dial_code: '+82',
    fr_name: 'Corée du Sud',
    de_name: 'Südkorea'
  },
  {
    name: 'Kosovo',
    flag: '🇽🇰',
    code: 'XK',
    dial_code: '+383',
    fr_name: 'Kosovo',
    de_name: 'Kosovo'
  },
  {
    name: 'Kuwait',
    flag: '🇰🇼',
    code: 'KW',
    dial_code: '+965',
    fr_name: 'Koweït',
    de_name: 'Kuwait'
  },
  {
    name: 'Kyrgyzstan',
    flag: '🇰🇬',
    code: 'KG',
    dial_code: '+996',
    fr_name: 'Kirghizistan',
    de_name: 'Kirgisistan'
  },
  {
    name: 'Laos',
    flag: '🇱🇦',
    code: 'LA',
    dial_code: '+856',
    fr_name: 'Laos',
    de_name: 'Laos'
  },
  {
    name: 'Latvia',
    flag: '🇱🇻',
    code: 'LV',
    dial_code: '+371',
    fr_name: 'Lettonie',
    de_name: 'Lettland'
  },
  {
    name: 'Lebanon',
    flag: '🇱🇧',
    code: 'LB',
    dial_code: '+961',
    fr_name: 'Liban',
    de_name: 'Libanon'
  },
  {
    name: 'Lesotho',
    flag: '🇱🇸',
    code: 'LS',
    dial_code: '+266',
    fr_name: 'Lesotho',
    de_name: 'Lesotho'
  },
  {
    name: 'Liberia',
    flag: '🇱🇷',
    code: 'LR',
    dial_code: '+231',
    fr_name: 'Libéria',
    de_name: 'Liberia'
  },
  {
    name: 'Libyan Arab Jamahiriya',
    flag: '🇱🇾',
    code: 'LY',
    dial_code: '+218',
    fr_name: 'Libye',
    de_name: 'Libyen'
  },
  {
    name: 'Liechtenstein',
    flag: '🇱🇮',
    code: 'LI',
    dial_code: '+423',
    fr_name: 'Liechtenstein',
    de_name: 'Liechtenstein'
  },
  {
    name: 'Lithuania',
    flag: '🇱🇹',
    code: 'LT',
    dial_code: '+370',
    fr_name: 'Lituanie',
    de_name: 'Litauen'
  },
  {
    name: 'Luxembourg',
    flag: '🇱🇺',
    code: 'LU',
    dial_code: '+352',
    fr_name: 'Luxembourg',
    de_name: 'Luxemburg'
  },
  {
    name: 'Macao',
    flag: '🇲🇴',
    code: 'MO',
    dial_code: '+853',
    fr_name: 'Macao',
    de_name: 'Macao'
  },
  {
    name: 'Macedonia',
    flag: '🇲🇰',
    code: 'MK',
    dial_code: '+389',
    fr_name: 'Macédoine',
    de_name: 'Mazedonien'
  },
  {
    name: 'Madagascar',
    flag: '🇲🇬',
    code: 'MG',
    dial_code: '+261',
    fr_name: 'Madagascar',
    de_name: 'Madagaskar'
  },
  {
    name: 'Malawi',
    flag: '🇲🇼',
    code: 'MW',
    dial_code: '+265',
    fr_name: 'Malawi',
    de_name: 'Malawi'
  },
  {
    name: 'Malaysia',
    flag: '🇲🇾',
    code: 'MY',
    dial_code: '+60',
    fr_name: 'Malaisie',
    de_name: 'Malaysia'
  },
  {
    name: 'Maldives',
    flag: '🇲🇻',
    code: 'MV',
    dial_code: '+960',
    fr_name: 'Maldives',
    de_name: 'Malediven'
  },
  {
    name: 'Mali',
    flag: '🇲🇱',
    code: 'ML',
    dial_code: '+223',
    fr_name: 'Mali',
    de_name: 'Mali'
  },
  {
    name: 'Malta',
    flag: '🇲🇹',
    code: 'MT',
    dial_code: '+356',
    fr_name: 'Malte',
    de_name: 'Malta'
  },
  {
    name: 'Marshall Islands',
    flag: '🇲🇭',
    code: 'MH',
    dial_code: '+692',
    fr_name: 'Îles Marshall',
    de_name: 'Marshallinseln'
  },
  {
    name: 'Martinique',
    flag: '🇲🇶',
    code: 'MQ',
    dial_code: '+596',
    fr_name: 'Martinique',
    de_name: 'Martinique'
  },
  {
    name: 'Mauritania',
    flag: '🇲🇷',
    code: 'MR',
    dial_code: '+222',
    fr_name: 'Mauritanie',
    de_name: 'Mauretanien'
  },
  {
    name: 'Mauritius',
    flag: '🇲🇺',
    code: 'MU',
    dial_code: '+230',
    fr_name: 'Maurice',
    de_name: 'Mauritius'
  },
  {
    name: 'Mayotte',
    flag: '🇾🇹',
    code: 'YT',
    dial_code: '+262',
    fr_name: 'Mayotte',
    de_name: 'Mayotte'
  },
  {
    name: 'Mexico',
    flag: '🇲🇽',
    code: 'MX',
    dial_code: '+52',
    fr_name: 'Mexique',
    de_name: 'Mexiko'
  },
  {
    name: 'Micronesia, Federated States of Micronesia',
    flag: '🇫🇲',
    code: 'FM',
    dial_code: '+691',
    fr_name: 'Micronésie',
    de_name: 'Mikronesien'
  },
  {
    name: 'Moldova',
    flag: '🇲🇩',
    code: 'MD',
    dial_code: '+373',
    fr_name: 'Moldavie',
    de_name: 'Moldawien'
  },
  {
    name: 'Monaco',
    flag: '🇲🇨',
    code: 'MC',
    dial_code: '+377',
    fr_name: 'Monaco',
    de_name: 'Monaco'
  },
  {
    name: 'Mongolia',
    flag: '🇲🇳',
    code: 'MN',
    dial_code: '+976',
    fr_name: 'Mongolie',
    de_name: 'Mongolei'
  },
  {
    name: 'Montenegro',
    flag: '🇲🇪',
    code: 'ME',
    dial_code: '+382',
    fr_name: 'Monténégro',
    de_name: 'Montenegro'
  },
  {
    name: 'Montserrat',
    flag: '🇲🇸',
    code: 'MS',
    dial_code: '+1664',
    fr_name: 'Montserrat',
    de_name: 'Montserrat'
  },
  {
    name: 'Morocco',
    flag: '🇲🇦',
    code: 'MA',
    dial_code: '+212',
    fr_name: 'Maroc',
    de_name: 'Marokko'
  },
  {
    name: 'Mozambique',
    flag: '🇲🇿',
    code: 'MZ',
    dial_code: '+258',
    fr_name: 'Mozambique',
    de_name: 'Mosambik'
  },
  {
    name: 'Myanmar',
    flag: '🇲🇲',
    code: 'MM',
    dial_code: '+95',
    fr_name: 'Myanmar',
    de_name: 'Myanmar'
  },
  {
    name: 'Namibia',
    flag: '🇳🇦',
    code: 'NA',
    dial_code: '+264',
    fr_name: 'Namibie',
    de_name: 'Namibia'
  },
  {
    name: 'Nauru',
    flag: '🇳🇷',
    code: 'NR',
    dial_code: '+674',
    fr_name: 'Nauru',
    de_name: 'Nauru'
  },
  {
    name: 'Nepal',
    flag: '🇳🇵',
    code: 'NP',
    dial_code: '+977',
    fr_name: 'Népal',
    de_name: 'Nepal'
  },
  {
    name: 'Netherlands',
    flag: '🇳🇱',
    code: 'NL',
    dial_code: '+31',
    fr_name: 'Pays-Bas',
    de_name: 'Niederlande'
  },
  {
    name: 'Netherlands Antilles',
    flag: '',
    code: 'AN',
    dial_code: '+599',
    fr_name: 'Antilles néerlandaises',
    de_name: 'Niederländische Antillen'
  },
  {
    name: 'New Caledonia',
    flag: '🇳🇨',
    code: 'NC',
    dial_code: '+687',
    fr_name: 'Nouvelle-Calédonie',
    de_name: 'Neukaledonien'
  },
  {
    name: 'New Zealand',
    flag: '🇳🇿',
    code: 'NZ',
    dial_code: '+64',
    fr_name: 'Nouvelle-Zélande',
    de_name: 'Neuseeland'
  },
  {
    name: 'Nicaragua',
    flag: '🇳🇮',
    code: 'NI',
    dial_code: '+505',
    fr_name: 'Nicaragua',
    de_name: 'Nicaragua'
  },
  {
    name: 'Niger',
    flag: '🇳🇪',
    code: 'NE',
    dial_code: '+227',
    fr_name: 'Niger',
    de_name: 'Niger'
  },
  {
    name: 'Nigeria',
    flag: '🇳🇬',
    code: 'NG',
    dial_code: '+234',
    fr_name: 'Nigéria',
    de_name: 'Nigeria'
  },
  {
    name: 'Niue',
    flag: '🇳🇺',
    code: 'NU',
    dial_code: '+683',
    fr_name: 'Niue',
    de_name: 'Niue'
  },
  {
    name: 'Norfolk Island',
    flag: '🇳🇫',
    code: 'NF',
    dial_code: '+672',
    fr_name: 'Île Norfolk',
    de_name: 'Norfolkinsel'
  },
  {
    name: 'Northern Mariana Islands',
    flag: '🇲🇵',
    code: 'MP',
    dial_code: '+1670',
    fr_name: 'Îles Mariannes du Nord',
    de_name: 'Nördliche Marianen'
  },
  {
    name: 'Norway',
    flag: '🇳🇴',
    code: 'NO',
    dial_code: '+47',
    fr_name: 'Norvège',
    de_name: 'Norwegen'
  },
  {
    name: 'Oman',
    flag: '🇴🇲',
    code: 'OM',
    dial_code: '+968',
    fr_name: 'Oman',
    de_name: 'Oman'
  },
  {
    name: 'Pakistan',
    flag: '🇵🇰',
    code: 'PK',
    dial_code: '+92',
    fr_name: 'Pakistan',
    de_name: 'Pakistan'
  },
  {
    name: 'Palau',
    flag: '🇵🇼',
    code: 'PW',
    dial_code: '+680',
    fr_name: 'Palaos',
    de_name: 'Palau'
  },
  {
    name: 'Palestinian Territory, Occupied',
    flag: '🇵🇸',
    code: 'PS',
    dial_code: '+970',
    fr_name: 'Territoire palestinien occupé',
    de_name: 'Palästinensische Autonomiegebiete'
  },
  {
    name: 'Panama',
    flag: '🇵🇦',
    code: 'PA',
    dial_code: '+507',
    fr_name: 'Panama',
    de_name: 'Panama'
  },
  {
    name: 'Papua New Guinea',
    flag: '🇵🇬',
    code: 'PG',
    dial_code: '+675',
    fr_name: 'Papouasie-Nouvelle-Guinée',
    de_name: 'Papua-Neuguinea'
  },
  {
    name: 'Paraguay',
    flag: '🇵🇾',
    code: 'PY',
    dial_code: '+595',
    fr_name: 'Paraguay',
    de_name: 'Paraguay'
  },
  {
    name: 'Peru',
    flag: '🇵🇪',
    code: 'PE',
    dial_code: '+51',
    fr_name: 'Pérou',
    de_name: 'Peru'
  },
  {
    name: 'Philippines',
    flag: '🇵🇭',
    code: 'PH',
    dial_code: '+63',
    fr_name: 'Philippines',
    de_name: 'Philippinen'
  },
  {
    name: 'Pitcairn',
    flag: '🇵🇳',
    code: 'PN',
    dial_code: '+64',
    fr_name: 'Pitcairn',
    de_name: 'Pitcairninseln'
  },
  {
    name: 'Poland',
    flag: '🇵🇱',
    code: 'PL',
    dial_code: '+48',
    fr_name: 'Pologne',
    de_name: 'Polen'
  },
  {
    name: 'Portugal',
    flag: '🇵🇹',
    code: 'PT',
    dial_code: '+351',
    fr_name: 'Portugal',
    de_name: 'Portugal'
  },
  {
    name: 'Puerto Rico',
    flag: '🇵🇷',
    code: 'PR',
    dial_code: '+1939',
    fr_name: 'Porto Rico',
    de_name: 'Puerto Rico'
  },
  {
    name: 'Qatar',
    flag: '🇶🇦',
    code: 'QA',
    dial_code: '+974',
    fr_name: 'Qatar',
    de_name: 'Katar'
  },
  {
    name: 'Romania',
    flag: '🇷🇴',
    code: 'RO',
    dial_code: '+40',
    fr_name: 'Roumanie',
    de_name: 'Rumänien'
  },
  {
    name: 'Russia',
    flag: '🇷🇺',
    code: 'RU',
    dial_code: '+7',
    fr_name: 'Russie',
    de_name: 'Russland'
  },
  {
    name: 'Rwanda',
    flag: '🇷🇼',
    code: 'RW',
    dial_code: '+250',
    fr_name: 'Rwanda',
    de_name: 'Ruanda'
  },
  {
    name: 'Reunion',
    flag: '🇷🇪',
    code: 'RE',
    dial_code: '+262',
    fr_name: 'Réunion',
    de_name: 'Réunion'
  },
  {
    name: 'Saint Barthelemy',
    flag: '🇧🇱',
    code: 'BL',
    dial_code: '+590',
    fr_name: 'Saint-Barthélemy',
    de_name: 'Saint-Barthélemy'
  },
  {
    name: 'Saint Helena, Ascension and Tristan Da Cunha',
    flag: '🇸🇭',
    code: 'SH',
    dial_code: '+290',
    fr_name: 'Sainte-Hélène, Ascension et Tristan da Cunha',
    de_name: 'St. Helena, Ascension und Tristan da Cunha'
  },
  {
    name: 'Saint Kitts and Nevis',
    flag: '🇰🇳',
    code: 'KN',
    dial_code: '+1869',
    fr_name: 'Saint-Christophe-et-Niévès',
    de_name: 'St. Kitts und Nevis'
  },
  {
    name: 'Saint Lucia',
    flag: '🇱🇨',
    code: 'LC',
    dial_code: '+1758',
    fr_name: 'Sainte-Lucie',
    de_name: 'St. Lucia'
  },
  {
    name: 'Saint Martin',
    flag: '🇲🇫',
    code: 'MF',
    dial_code: '+590',
    fr_name: 'Saint-Martin',
    de_name: 'Saint-Martin'
  },
  {
    name: 'Saint Pierre and Miquelon',
    flag: '🇵🇲',
    code: 'PM',
    dial_code: '+508',
    fr_name: 'Saint-Pierre-et-Miquelon',
    de_name: 'Saint-Pierre und Miquelon'
  },
  {
    name: 'Saint Vincent and the Grenadines',
    flag: '🇻🇨',
    code: 'VC',
    dial_code: '+1784',
    fr_name: 'Saint-Vincent-et-les-Grenadines',
    de_name: 'St. Vincent und die Grenadinen'
  },
  {
    name: 'Samoa',
    flag: '🇼🇸',
    code: 'WS',
    dial_code: '+685',
    fr_name: 'Samoa',
    de_name: 'Samoa'
  },
  {
    name: 'San Marino',
    flag: '🇸🇲',
    code: 'SM',
    dial_code: '+378',
    fr_name: 'Saint-Marin',
    de_name: 'San Marino'
  },
  {
    name: 'Sao Tome and Principe',
    flag: '🇸🇹',
    code: 'ST',
    dial_code: '+239',
    fr_name: 'Sao Tomé-et-Principe',
    de_name: 'São Tomé und Príncipe'
  },
  {
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    code: 'SA',
    dial_code: '+966',
    fr_name: 'Arabie saoudite',
    de_name: 'Saudi-Arabien'
  },
  {
    name: 'Senegal',
    flag: '🇸🇳',
    code: 'SN',
    dial_code: '+221',
    fr_name: 'Sénégal',
    de_name: 'Senegal'
  },
  {
    name: 'Serbia',
    flag: '🇷🇸',
    code: 'RS',
    dial_code: '+381',
    fr_name: 'Serbie',
    de_name: 'Serbien'
  },
  {
    name: 'Seychelles',
    flag: '🇸🇨',
    code: 'SC',
    dial_code: '+248',
    fr_name: 'Seychelles',
    de_name: 'Seychellen'
  },
  {
    name: 'Sierra Leone',
    flag: '🇸🇱',
    code: 'SL',
    dial_code: '+232',
    fr_name: 'Sierra Leone',
    de_name: 'Sierra Leone'
  },
  {
    name: 'Singapore',
    flag: '🇸🇬',
    code: 'SG',
    dial_code: '+65',
    fr_name: 'Singapour',
    de_name: 'Singapur'
  },
  {
    name: 'Slovakia',
    flag: '🇸🇰',
    code: 'SK',
    dial_code: '+421',
    fr_name: 'Slovaquie',
    de_name: 'Slowakei'
  },
  {
    name: 'Slovenia',
    flag: '🇸🇮',
    code: 'SI',
    dial_code: '+386',
    fr_name: 'Slovénie',
    de_name: 'Slowenien'
  },
  {
    name: 'Solomon Islands',
    flag: '🇸🇧',
    code: 'SB',
    dial_code: '+677',
    fr_name: 'Îles Salomon',
    de_name: 'Salomonen'
  },
  {
    name: 'Somalia',
    flag: '🇸🇴',
    code: 'SO',
    dial_code: '+252',
    fr_name: 'Somalie',
    de_name: 'Somalia'
  },
  {
    name: 'South Africa',
    flag: '🇿🇦',
    code: 'ZA',
    dial_code: '+27',
    fr_name: 'Afrique du Sud',
    de_name: 'Südafrika'
  },
  {
    name: 'South Sudan',
    flag: '🇸🇸',
    code: 'SS',
    dial_code: '+211',
    fr_name: 'Soudan du Sud',
    de_name: 'Südsudan'
  },
  {
    name: 'South Georgia and the South Sandwich Islands',
    flag: '🇬🇸',
    code: 'GS',
    dial_code: '+500',
    fr_name: 'Géorgie du Sud-et-les Îles Sandwich du Sud',
    de_name: 'Südgeorgien und die Südlichen Sandwichinseln'
  },
  {
    name: 'Spain',
    flag: '🇪🇸',
    code: 'ES',
    dial_code: '+34',
    fr_name: 'Espagne',
    de_name: 'Spanien'
  },
  {
    name: 'Sri Lanka',
    flag: '🇱🇰',
    code: 'LK',
    dial_code: '+94',
    fr_name: 'Sri Lanka',
    de_name: 'Sri Lanka'
  },
  {
    name: 'Sudan',
    flag: '🇸🇩',
    code: 'SD',
    dial_code: '+249',
    fr_name: 'Soudan',
    de_name: 'Sudan'
  },
  {
    name: 'Suriname',
    flag: '🇸🇷',
    code: 'SR',
    dial_code: '+597',
    fr_name: 'Suriname',
    de_name: 'Suriname'
  },
  {
    name: 'Svalbard and Jan Mayen',
    flag: '🇸🇯',
    code: 'SJ',
    dial_code: '+47',
    fr_name: 'Svalbard et Jan Mayen',
    de_name: 'Svalbard und Jan Mayen'
  },
  {
    name: 'Swaziland',
    flag: '🇸🇿',
    code: 'SZ',
    dial_code: '+268',
    fr_name: 'Swaziland',
    de_name: 'Swasiland'
  },
  {
    name: 'Sweden',
    flag: '🇸🇪',
    code: 'SE',
    dial_code: '+46',
    fr_name: 'Suède',
    de_name: 'Schweden'
  },
  {
    name: 'Switzerland',
    flag: '🇨🇭',
    code: 'CH',
    dial_code: '+41',
    fr_name: 'Suisse',
    de_name: 'Schweiz'
  },
  {
    name: 'Syrian Arab Republic',
    flag: '🇸🇾',
    code: 'SY',
    dial_code: '+963',
    fr_name: 'Syrie',
    de_name: 'Syrien'
  },
  {
    name: 'Taiwan',
    flag: '🇹🇼',
    code: 'TW',
    dial_code: '+886',
    fr_name: 'Taïwan',
    de_name: 'Taiwan'
  },
  {
    name: 'Tajikistan',
    flag: '🇹🇯',
    code: 'TJ',
    dial_code: '+992',
    fr_name: 'Tadjikistan',
    de_name: 'Tadschikistan'
  },
  {
    name: 'Tanzania, United Republic of Tanzania',
    flag: '🇹🇿',
    code: 'TZ',
    dial_code: '+255',
    fr_name: 'Tanzanie',
    de_name: 'Tansania'
  },
  {
    name: 'Thailand',
    flag: '🇹🇭',
    code: 'TH',
    dial_code: '+66',
    fr_name: 'Thaïlande',
    de_name: 'Thailand'
  },
  {
    name: 'Timor-Leste',
    flag: '🇹🇱',
    code: 'TL',
    dial_code: '+670',
    fr_name: 'Timor oriental',
    de_name: 'Timor-Leste'
  },
  {
    name: 'Togo',
    flag: '🇹🇬',
    code: 'TG',
    dial_code: '+228',
    fr_name: 'Togo',
    de_name: 'Togo'
  },
  {
    name: 'Tokelau',
    flag: '🇹🇰',
    code: 'TK',
    dial_code: '+690',
    fr_name: 'Tokelau',
    de_name: 'Tokelau'
  },
  {
    name: 'Tonga',
    flag: '🇹🇴',
    code: 'TO',
    dial_code: '+676',
    fr_name: 'Tonga',
    de_name: 'Tonga'
  },
  {
    name: 'Trinidad and Tobago',
    flag: '🇹🇹',
    code: 'TT',
    dial_code: '+1868',
    fr_name: 'Trinité-et-Tobago',
    de_name: 'Trinidad und Tobago'
  },
  {
    name: 'Tunisia',
    flag: '🇹🇳',
    code: 'TN',
    dial_code: '+216',
    fr_name: 'Tunisie',
    de_name: 'Tunesien'
  },
  {
    name: 'Turkey',
    flag: '🇹🇷',
    code: 'TR',
    dial_code: '+90',
    fr_name: 'Turquie',
    de_name: 'Türkei'
  },
  {
    name: 'Turkmenistan',
    flag: '🇹🇲',
    code: 'TM',
    dial_code: '+993',
    fr_name: 'Turkménistan',
    de_name: 'Turkmenistan'
  },
  {
    name: 'Turks and Caicos Islands',
    flag: '🇹🇨',
    code: 'TC',
    dial_code: '+1649',
    fr_name: 'Îles Turques-et-Caïques',
    de_name: 'Turks- und Caicosinseln'
  },
  {
    name: 'Tuvalu',
    flag: '🇹🇻',
    code: 'TV',
    dial_code: '+688',
    fr_name: 'Tuvalu',
    de_name: 'Tuvalu'
  },
  {
    name: 'Uganda',
    flag: '🇺🇬',
    code: 'UG',
    dial_code: '+256',
    fr_name: 'Ouganda',
    de_name: 'Uganda'
  },
  {
    name: 'Ukraine',
    flag: '🇺🇦',
    code: 'UA',
    dial_code: '+380',
    fr_name: 'Ukraine',
    de_name: 'Ukraine'
  },
  {
    name: 'United Arab Emirates',
    flag: '🇦🇪',
    code: 'AE',
    dial_code: '+971',
    fr_name: 'Émirats arabes unis',
    de_name: 'Vereinigte Arabische Emirate'
  },
  {
    name: 'United Kingdom',
    flag: '🇬🇧',
    code: 'GB',
    dial_code: '+44',
    fr_name: 'Royaume-Uni',
    de_name: 'Vereinigtes Königreich'
  },
  {
    name: 'United States',
    flag: '🇺🇸',
    code: 'US',
    dial_code: '+1',
    fr_name: 'États-Unis',
    de_name: 'Vereinigte Staaten'
  },
  {
    name: 'Uruguay',
    flag: '🇺🇾',
    code: 'UY',
    dial_code: '+598',
    fr_name: 'Uruguay',
    de_name: 'Uruguay'
  },
  {
    name: 'Uzbekistan',
    flag: '🇺🇿',
    code: 'UZ',
    dial_code: '+998',
    fr_name: 'Ouzbékistan',
    de_name: 'Usbekistan'
  },
  {
    name: 'Vanuatu',
    flag: '🇻🇺',
    code: 'VU',
    dial_code: '+678',
    fr_name: 'Vanuatu',
    de_name: 'Vanuatu'
  },
  {
    name: 'Venezuela',
    flag: '🇻🇪',
    code: 'VE',
    dial_code: '+58',
    fr_name: 'Venezuela',
    de_name: 'Venezuela'
  },
  {
    name: 'Vietnam',
    flag: '🇻🇳',
    code: 'VN',
    dial_code: '+84',
    fr_name: 'Vietnam',
    de_name: 'Vietnam'
  },
  {
    name: 'Virgin Islands, British',
    flag: '🇻🇬',
    code: 'VG',
    dial_code: '+1284',
    fr_name: 'Îles Vierges britanniques',
    de_name: 'Britische Jungferninseln'
  },
  {
    name: 'Virgin Islands, U.S.',
    flag: '🇻🇮',
    code: 'VI',
    dial_code: '+1340',
    fr_name: 'Îles Vierges des États-Unis',
    de_name: 'Amerikanische Jungferninseln'
  },
  {
    name: 'Wallis and Futuna',
    flag: '🇼🇫',
    code: 'WF',
    dial_code: '+681',
    fr_name: 'Wallis-et-Futuna',
    de_name: 'Wallis und Futuna'
  },
  {
    name: 'Yemen',
    flag: '🇾🇪',
    code: 'YE',
    dial_code: '+967',
    fr_name: 'Yémen',
    de_name: 'Jemen'
  },
  {
    name: 'Zambia',
    flag: '🇿🇲',
    code: 'ZM',
    dial_code: '+260',
    fr_name: 'Zambie',
    de_name: 'Sambia'
  },
  {
    name: 'Zimbabwe',
    flag: '🇿🇼',
    code: 'ZW',
    dial_code: '+263',
    fr_name: 'Zimbabwe',
    de_name: 'Simbabwe'
  }
] as const

type FullCountry = (typeof Countries)[number]

export type Country = Lowercase<(typeof Countries)[number]['code']>
export type CountryEnglishName = (typeof Countries)[number]['name']
export const CountryCodes = Countries.map(c => c.code.toLowerCase() as Country)

export const getFlag = (country: Country) => {
  return Countries.find(c => c.code === country.toUpperCase())?.flag || ''
}

export const countriesIso2 = Countries.map(c => c.code.toLowerCase() as Country)

export const CountriesByName = Countries.reduce<Record<CountryEnglishName, Country>>(
  (acc, c) => {
    acc[c.name] = c.code.toLowerCase() as Country
    return acc
  },
  {} as Record<CountryEnglishName, Country>
)

export type TranslateCountryOption = {
  includeFlag?: boolean
}
export const translateCountry = (
  country: FullCountry | Country,
  lang: SupportedCountriesLang,
  opts?: TranslateCountryOption
) => {
  const toTranslate =
    typeof country === 'string' ? Countries.find(c => c.code === country.toUpperCase()) : country
  if (!toTranslate) {
    console.error(`Country ${country} not found`)
    return country as string
  }
  return `${opts?.includeFlag ? `${toTranslate.flag} ` : ''}${
    lang === 'en' ? toTranslate.name : toTranslate[`${lang}_name`]
  }`
}

export const isCountry = (country: string): country is Country => {
  return CountryCodes.includes(country as Country)
}

export type SupportedCountriesLang = 'fr' | 'de' | 'en'

export const isSupportedCountriesLang = (lang: string): lang is SupportedCountriesLang => {
  return ['fr', 'de', 'en'].includes(lang)
}

export const zCountry = z.string().refine(isCountry, {
  message: 'Invalid country code'
}) as ZodType<Country>
