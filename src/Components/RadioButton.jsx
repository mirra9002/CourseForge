export default function RadioButton({title, id, checked, onChange}) {
  return (
    <>
      <div class="flex items-center mb-4">
        <input id={id} checked={checked} onChange={onChange} type="radio" value="" name="default-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" />
        <label for="default-radio-1" class="ms-2 text-sm font-medium text-gray-900">{title}</label>
    </div>
    </>
  );
}