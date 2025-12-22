export default function CourseFilters({filters, handleSetFilters}) {
    
    function toggleDifficulty(key) {
        handleSetFilters({...filters,
            difficulty: {
                ...filters.difficulty,
                [key]: !filters.difficulty[key]
            }
        })
    }
    

    function toggleType(key){
        handleSetFilters({...filters,
            type: {
                ...filters.type,
                [key]: !filters.type[key]
            }
        })
    }

    function toggleTime(key){
        handleSetFilters({...filters,
            time: {
                ...filters.time,
                [key]: !filters.time[key]
            }
        })
    }

    function toggleField(key){
        handleSetFilters({...filters,
            field: {
                ...filters.field,
                [key]: !filters.field[key]
            }
        })
    }


    return (<>

        
        <div class="block max-w-sm pl-8 pr-12 p-6 ml-2 bg-white border border-gray-200 rounded-lg shadow-sm ">

        <h4 class="text-2xl font-bold">Фільтри</h4>
                <br/>

                <p class="mb-0 text-gray-500">Рівень</p>
                <br/>
                <div class="flex items-center mb-2">
                    <input onChange={() => toggleDifficulty('easy')} id="default-checkbox" type="checkbox" value="" class=" cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"/>
                    <label for="default-checkbox" class=" cursor-pointer ms-2 text-sm font-medium text-gray-900">Початковий</label>
                </div>
                <div class="flex items-center mb-2">
                    <input onChange={() => toggleDifficulty('mid')} id="default-checkbox" type="checkbox" value="" class="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"/>
                    <label for="default-checkbox" class=" cursor-pointer ms-2 text-sm font-medium text-gray-900">Середній</label>
                </div>
                <div class="flex items-center mb-2">
                    <input onChange={() => toggleDifficulty('hard')} id="default-checkbox" type="checkbox" value="" class="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"/>
                    <label for="default-checkbox" class="cursor-pointer ms-2 text-sm font-medium text-gray-900">Складний</label>
                </div>      

                <br/>
                <p class="mb-0 text-gray-500">Тип</p>
                <br/>
                <div class="flex items-center mb-2">
                    <input onChange={() => toggleType('practice')} id="default-checkbox" type="checkbox" value="" class="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"/>
                    <label for="default-checkbox" class="cursor-pointer ms-2 text-sm font-medium text-gray-900">Практичні</label>
                </div>
                <div class="flex items-center mb-2">
                    <input onChange={() => toggleType('theory')} id="default-checkbox" type="checkbox" value="" class="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"/>
                    <label for="default-checkbox" class="cursor-pointer ms-2 text-sm font-medium text-gray-900">Теоретичні</label>
                </div>
                <div class="flex items-center mb-2">
                    <input onChange={() => toggleType('dev')} id="default-checkbox" type="checkbox" value="" class="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"/>
                    <label for="default-checkbox" class="cursor-pointer ms-2 text-sm font-medium text-gray-900">Розробка</label>
                </div>

                {/* <br/>
                <p class="mb-0 text-gray-500">Час проходження</p>
                <br/>
                <div class="flex items-center mb-2">
                    <input onChange={() => toggleTime('all')} id="default-radio-1" type="radio" value="" name="default-radio" class="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"/>
                    <label for="default-radio-1" class="cursor-pointer ms-2 text-sm font-medium text-gray-900">Усі</label>
                </div>
                <div class="flex items-center mb-2">
                    <input onChange={() => toggleTime('belowFive')} id="default-radio-1" type="radio" value="" name="default-radio" class="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"/>
                    <label for="default-radio-1" class="cursor-pointer ms-2 text-sm font-medium text-gray-900">До 5 годин</label>
                </div>
                <div class="flex items-center mb-2">
                    <input onChange={() => toggleTime('fiveTen')} id="default-radio-1" type="radio" value="" name="default-radio" class="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"/>
                    <label for="default-radio-1" class="cursor-pointer ms-2 text-sm font-medium text-gray-900">5 - 10 годин</label>
                </div>
                <div class="flex items-center mb-2">
                    <input onChange={() => toggleTime('aboveTen')} id="default-radio-1" type="radio" value="" name="default-radio" class="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"/>
                    <label for="default-radio-1" class="cursor-pointer ms-2 text-sm font-medium text-gray-900">10 годин і більше</label>
                </div>
                <br />
                <p class="mb-0 text-gray-500">Напрямок</p>
                <br/>
                <div class="flex items-center mb-2">
                    <input onChange={() => toggleField('all')} id="default-radio-1" type="checkbox" value="" name="default-radio" class="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"/>
                    <label for="default-radio-1" class="cursor-pointer ms-2 text-sm font-medium text-gray-900">Усі</label>
                </div>
                <div class="flex items-center mb-2">
                    <input onChange={() => toggleField('web')} id="default-radio-1" type="checkbox" value="" name="default-radio" class="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"/>
                    <label for="default-radio-1" class="cursor-pointer ms-2 text-sm font-medium text-gray-900">Web Development</label>
                </div>
                <div class="flex items-center mb-2">
                    <input onChange={() => toggleField('mobile')} id="default-radio-1" type="checkbox" value="" name="default-radio" class="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"/>
                    <label for="default-radio-1" class="cursor-pointer ms-2 text-sm font-medium text-gray-900">Mobile Development</label>
                </div>
                <div class="flex items-center mb-2">
                    <input onChange={() => toggleField('data')} id="default-radio-1" type="checkbox" value="" name="default-radio" class="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"/>
                    <label for="default-radio-1" class="cursor-pointer ms-2 text-sm font-medium text-gray-900">Data & AI</label>
                </div>
                <div class="flex items-center mb-2">
                    <input onChange={() => toggleField('cybersecurity')} id="default-radio-1" type="checkbox" value="" name="default-radio" class="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"/>
                    <label for="default-radio-1" class="cursor-pointer ms-2 text-sm font-medium text-gray-900">Cybersecurity</label>
                </div>
                <div class="flex items-center mb-2">
                    <input onChange={() => toggleField('uiux')} id="default-radio-1" type="checkbox" value="" name="default-radio" class="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 focus:ring-2"/>
                    <label for="default-radio-1" class="cursor-pointer ms-2 text-sm font-medium text-gray-900">UI/UX & Design</label>
                </div> */}
        </div>

    </>)
}