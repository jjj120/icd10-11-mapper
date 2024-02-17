import csv, json
from alive_progress import alive_bar

def convert_10_to_11_Multi():
    
    class Line:
        # 10ClassKind	Depth	icd10Code	icd10Chapter	icd10Title	11ClassKind	    Depth	ICD-11 Foundation URI	Linearization (release) URI	    icd11Code	icd11Chapter	icd11Title	2024-Jan-21
        def __init__(self, line: list[str]) -> None:
            self.icd10Code = line[2]
            self.icd11Code = line[9]
            self.foundUrl = line[7]
            self.linUrl = line[8]
            self.title10 = line[4]
            self.title11 = line[11]
        
        def to_dict(self) -> dict:
            return {
                'icd10Code': self.icd10Code,
                'icd11Code': self.icd11Code,
                'foundUrl': self.foundUrl,
                'linUrl': self.linUrl,
                'title10': self.title10,
                'title11': self.title11
            }
        
            

    data: list[Line] = []

    with open('mapping/10To11MapToMultipleCategories.txt', 'r') as file:
        reader = csv.reader(file, delimiter='\t')
        for row in reader:
            data.append(Line(row))

    def convert_to_dict(data: list[Line]) -> dict:
        keys = [line.icd10Code for line in data]
        with alive_bar(len(keys)) as bar:
            data_dict = {}
            for key in keys:
                data_dict[key] = []
                for line in data:
                    if line.icd10Code == key:
                        data_dict[key].append(line.to_dict())
                bar()
    
        return data_dict
    
    data = data[1:] # remove header
    data_dict =convert_to_dict(data)
    
    
    with open('mapped/10To11MapToMultipleCategories.json', 'w', newline='') as file:
        json.dump(data_dict, file, indent=4, sort_keys=True)
        
    print('Done')


if __name__ == '__main__':
    convert_10_to_11_Multi()