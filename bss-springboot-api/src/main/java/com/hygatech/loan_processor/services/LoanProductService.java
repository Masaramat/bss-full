package com.hygatech.loan_processor.services;

import com.hygatech.loan_processor.dtos.LoanProductDto;
import com.hygatech.loan_processor.entities.LoanProduct;
import com.hygatech.loan_processor.exceptions.ObjectNotFoundException;
import com.hygatech.loan_processor.repositories.LoanProductRepository;
import com.hygatech.loan_processor.utils.LoanProductUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class LoanProductService {
    private final LoanProductRepository repository;

    public LoanProductDto create(LoanProductDto productDto){
        try{
            LoanProduct product = LoanProductUtil.toEntity(productDto);

            return LoanProductUtil.toDto(repository.save(product));
        }catch (RuntimeException ex){
            throw new RuntimeException(ex.getMessage());
        }

    }

    public Stream<LoanProductDto> all(){
        return repository.findAll().stream().map(LoanProductUtil::toDto);
    }

    public LoanProductDto find(Long id){
        return LoanProductUtil.toDto(getLoanProduct(id));

    }

    public LoanProductDto update(LoanProductDto dto){
        LoanProduct product = getLoanProduct(dto.getId());
        if (dto.getName() != null){
            product.setName(dto.getName());
        }
        if (dto.getMonitoringFeeRate() != null){
            product.setMonitoringFeeRate(dto.getMonitoringFeeRate());
        }
        if (dto.getInterestRate() != null){
            product.setInterestRate(dto.getInterestRate());
        }

        if (dto.getTenor() != null){
            product.setTenor(dto.getTenor());
        }
        if (dto.getProcessingFeeRate() != null){
            product.setProcessingFeeRate(dto.getProcessingFeeRate());
        }

        return LoanProductUtil.toDto(repository.save(product));
    }

    private LoanProduct getLoanProduct(Long id){
        Optional<LoanProduct> loanProductOptional = repository.findById(id);

        if (loanProductOptional.isEmpty()){
            throw new ObjectNotFoundException("Loan product not found");
        }

        return loanProductOptional.get();
    }

}
